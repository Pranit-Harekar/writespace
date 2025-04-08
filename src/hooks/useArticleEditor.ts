
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { stripHtml } from '@/lib/textUtils';

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

  // Article content state
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');

  // Article metadata state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(false);

  // Last saved state reference
  const lastSavedStateRef = useRef({
    title: '',
    content: '',
    subtitle: '',
  });

  // Article data cache reference
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

  // Calculate read time automatically
  const readTime = (() => {
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 225)); // 225 words per minute
  })();

  // Check if the article has been modified
  const hasBeenModified = useCallback(() => {
    return (
      title !== lastSavedStateRef.current.title ||
      content !== lastSavedStateRef.current.content ||
      subtitle !== lastSavedStateRef.current.subtitle
    );
  }, [title, content, subtitle]);

  // Save current state to the ref to preserve it when component unmounts
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

  // Fetch article if editing and not already loaded
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

        // Check if current user is the author
        if (data.author_id !== user.id) {
          toast({
            title: 'Unauthorized',
            description: "You don't have permission to edit this article",
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        // Set the article content
        setTitle(data.title);
        setContent(data.content);
        setSubtitle(data.subtitle || '');

        // Update last saved state
        lastSavedStateRef.current = {
          title: data.title,
          content: data.content,
          subtitle: data.subtitle || '',
        };

        // Set the metadata
        setCategoryId(data.category_id);
        setCategoryName(data.category || (data.categories ? data.categories.name : ''));
        setLanguage(data.language);
        setFeaturedImage(data.featured_image || '');
        setIsPublished(data.is_published || false);

        // Mark as loaded to avoid refetching
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

  // Restore state from ref when coming back to component
  useEffect(() => {
    // Only restore if we've already loaded the article before
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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create or edit articles',
        variant: 'destructive',
      });
      return;
    }

    // Only create a timestamp-based title if the user is saving without a title
    const finalTitle = title.trim() || `Draft - ${new Date().toLocaleTimeString()}`;
    
    setIsLoading(true);

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
        // Update existing article
        response = await supabase.from('articles').update(articleData).eq('id', id);
      } else {
        // Create new article
        response = await supabase.from('articles').insert(articleData).select();
      }

      if (response.error) throw response.error;

      // Update last saved state
      lastSavedStateRef.current = {
        title: finalTitle,
        content,
        subtitle,
      };

      // Update the title state if a timestamp was used
      if (!title.trim()) {
        setTitle(finalTitle);
      }

      toast({
        title: isEditing ? 'Article updated' : 'Article created',
        description: `Your article has been ${isEditing ? 'updated' : 'created'} successfully`,
      });

      if (!isEditing && response.data) {
        // Navigate to the newly created article
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
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;

    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

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
    // State
    id,
    isLoading,
    isDeleting,
    isSaving,
    hasLoaded,
    isEditing,

    // Article content
    title,
    content,
    subtitle,

    // Metadata
    categoryId,
    categoryName,
    language,
    featuredImage,
    isPublished,

    // Methods
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
