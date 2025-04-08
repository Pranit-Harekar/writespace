import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { stripHtml } from '@/lib/textUtils';
import { articleImagesService } from '@/services/articleImagesService';

interface ArticleState {
  title: string;
  content: string;
  subtitle: string;
  categoryId: string | null;
  categoryName: string;
  language: string;
  featuredImage: string;
  isPublished: boolean;
}

export function useArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const lastSavedStateRef = useRef({
    title: '',
    content: '',
    subtitle: '',
  });

  const articleDataRef = useRef<ArticleState>({
    title: '',
    content: '',
    subtitle: '',
    categoryId: null,
    categoryName: '',
    language: 'en',
    featuredImage: '',
    isPublished: false,
  });

  const isEditing = Boolean(id);

  const readTime = (() => {
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 225)); // 225 words per minute
  })();

  const hasBeenModified = useCallback(() => {
    return (
      title !== lastSavedStateRef.current.title ||
      content !== lastSavedStateRef.current.content ||
      subtitle !== lastSavedStateRef.current.subtitle
    );
  }, [title, content, subtitle]);

  useEffect(() => {
    articleDataRef.current = {
      title,
      content,
      subtitle,
      categoryId,
      categoryName,
      language,
      featuredImage,
      isPublished,
    };
  }, [title, content, subtitle, categoryId, categoryName, language, featuredImage, isPublished]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || !user || hasLoaded) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, categories:category_id(id, name)')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data.author_id !== user.id) {
          toast({
            title: 'Unauthorized',
            description: "You don't have permission to edit this article",
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setSubtitle(data.subtitle || '');

        lastSavedStateRef.current = {
          title: data.title,
          content: data.content,
          subtitle: data.subtitle || '',
        };

        setCategoryId(data.category_id);
        setCategoryName(data.category || (data.categories ? data.categories.name : ''));
        setLanguage(data.language);
        setFeaturedImage(data.featured_image || '');
        setIsPublished(data.is_published || false);

        setHasLoaded(true);
      } catch (error: any) {
        console.error('Error fetching article:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load article',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate, toast, hasLoaded]);

  useEffect(() => {
    if (hasLoaded && isEditing) {
      setTitle(articleDataRef.current.title);
      setContent(articleDataRef.current.content);
      setSubtitle(articleDataRef.current.subtitle);
      setCategoryId(articleDataRef.current.categoryId);
      setCategoryName(articleDataRef.current.categoryName);
      setLanguage(articleDataRef.current.language);
      setFeaturedImage(articleDataRef.current.featuredImage);
      setIsPublished(articleDataRef.current.isPublished);
    }
  }, [hasLoaded, isEditing]);

  const validateForPublishing = () => {
    const isDraftTitle = /^Draft - \d{1,2}:\d{2}:\d{2}(?: [AP]M)?$/.test(title);
    if (isDraftTitle) {
      toast({
        title: 'Publishing Failed',
        description: 'Please provide a proper title before publishing',
        variant: 'destructive',
      });
      return false;
    }

    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 30) {
      toast({
        title: 'Publishing Failed',
        description: 'Content must be at least 30 words',
        variant: 'destructive',
      });
      return false;
    }

    if (!categoryId) {
      toast({
        title: 'Publishing Failed',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create or edit articles',
        variant: 'destructive',
      });
      return;
    }

    const finalTitle = title.trim() || `Draft - ${new Date().toLocaleTimeString()}`;

    if (isPublished && !validateForPublishing()) {
      setIsPublished(false);
      return;
    }

    setIsSaving(true);

    try {
      const articleData = {
        title: finalTitle,
        content,
        subtitle,
        author_id: user.id,
        category_id: categoryId,
        language,
        featured_image: featuredImage,
        read_time: readTime,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      };

      let response;

      if (isEditing) {
        response = await supabase.from('articles').update(articleData).eq('id', id);
      } else {
        response = await supabase.from('articles').insert(articleData).select();
      }

      if (response.error) throw response.error;

      const articleIdToUse = isEditing ? id : response.data?.[0]?.id;
      if (articleIdToUse) {
        await performImageCleanup(articleIdToUse, content, featuredImage);
      }

      lastSavedStateRef.current = {
        title: finalTitle,
        content,
        subtitle,
      };

      if (!title.trim()) {
        setTitle(finalTitle);
      }

      toast({
        title: isEditing ? 'Article updated' : 'Article created',
        description: `Your article has been ${isEditing ? 'updated' : 'created'} successfully`,
      });

      if (!isEditing && response.data) {
        navigate(`/article/edit/${response.data[0].id}`);
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} article`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const performImageCleanup = async (
    articleId: string,
    htmlContent: string,
    featuredImageUrl: string
  ) => {
    try {
      const contentImageUrls = articleImagesService.extractImageUrls(htmlContent);
      const currentUrls = [...contentImageUrls];

      if (featuredImageUrl) {
        currentUrls.push(featuredImageUrl);
      }

      await articleImagesService.cleanupOrphanedImages(articleId, currentUrls);
    } catch (error) {
      console.error('Error during image cleanup:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .eq('author_id', user.id);

      if (error) throw error;

      toast({
        title: 'Article deleted',
        description: 'Your article has been deleted successfully',
      });

      navigate('/my-articles');
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete article',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryChange = (categoryName: string, id: string | null) => {
    setCategoryName(categoryName);
    setCategoryId(id);
  };

  return {
    id,
    isLoading,
    isDeleting,
    isSaving,
    hasLoaded,
    isEditing,

    title,
    content,
    subtitle,

    categoryId,
    categoryName,
    language,
    featuredImage,
    isPublished,

    setTitle,
    setContent,
    setSubtitle,
    setLanguage,
    setFeaturedImage,
    setIsPublished,
    handleCategoryChange,
    handleSave,
    handleDelete,
  };
}
