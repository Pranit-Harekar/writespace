
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import ArticleContentEditor from '@/components/ArticleContentEditor';
import ArticleMetaSidebar from '@/components/ArticleMetaSidebar';
import { stripHtml } from '@/lib/textUtils';

const ArticleEditor = () => {
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
  
  // Auto-save timer reference
  const autoSaveTimerRef = useRef<number | null>(null);
  // Last saved state reference
  const lastSavedStateRef = useRef({
    title: '',
    content: '',
    subtitle: '',
  });

  // Calculate read time automatically
  const readTime = useMemo(() => {
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 225)); // 225 words per minute
  }, [content]);

  const isEditing = Boolean(id);

  // Cache article data to prevent refetching when switching tabs
  const articleDataRef = useRef({
    title: '',
    content: '',
    subtitle: '',
    categoryId: null as string | null,
    categoryName: '',
    language: 'en',
    featuredImage: '',
    isPublished: false,
  });

  // Check if the article has been modified
  const hasBeenModified = useCallback(() => {
    return (
      title !== lastSavedStateRef.current.title ||
      content !== lastSavedStateRef.current.content ||
      subtitle !== lastSavedStateRef.current.subtitle
    );
  }, [title, content, subtitle]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!user || !id || !hasBeenModified()) return;

    setIsSaving(true);
    try {
      // Calculate a title for drafts if needed
      const finalTitle = title.trim() || `Draft - ${new Date().toLocaleTimeString()}`;
      
      await supabase
        .from('articles')
        .update({
          title: finalTitle,
          content,
          subtitle,
        })
        .eq('id', id);
      
      // Update last saved state
      lastSavedStateRef.current = {
        title: finalTitle,
        content,
        subtitle,
      };
      
      // If title was empty and we set a timestamp, update the local state
      if (!title.trim()) {
        setTitle(finalTitle);
      }
      
      console.log('Auto-saved draft');
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, id, title, content, subtitle, hasBeenModified]);

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

  // Set up auto-save
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set a new timer if we're editing (not creating) and there are changes
    if (isEditing && hasBeenModified()) {
      autoSaveTimerRef.current = window.setTimeout(autoSave, 5000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSave, hasBeenModified, isEditing]);

  // Auto-save before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasBeenModified()) {
        autoSave();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Do a final auto-save when component unmounts
      if (hasBeenModified()) {
        autoSave();
      }
    };
  }, [autoSave, hasBeenModified]);

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
      } catch (error: unknown) {
        console.error('Error fetching article:', error);
        toast({
          title: 'Error',
          description: error['message'] || 'Failed to load article',
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

  const handleCategoryChange = (categoryName: string, id: string | null) => {
    setCategoryName(categoryName);
    setCategoryId(id);
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

    // If title is empty, set a timestamp as title
    const finalTitle = title.trim() || `Draft - ${new Date().toLocaleTimeString()}`;
    if (!title.trim()) {
      setTitle(finalTitle);
    }

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
        read_time: readTime, // Use automatically calculated read time
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

      toast({
        title: isEditing ? 'Article updated' : 'Article created',
        description: `Your article has been ${isEditing ? 'updated' : 'created'} successfully`,
      });

      if (!isEditing && response.data) {
        // Navigate to the newly created article
        navigate(`/article/edit/${response.data[0].id}`);
      }
    } catch (error: unknown) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: error['message'] || `Failed to ${isEditing ? 'update' : 'create'} article`,
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
    } catch (error: unknown) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: error['message'] || 'Failed to delete article',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && isEditing && !hasLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center h-full">
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex items-center gap-2">
            {isSaving && <span className="text-sm text-muted-foreground">Saving...</span>}
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              )}
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ArticleContentEditor
              initialContent={content}
              initialTitle={title}
              initialSubtitle={subtitle}
              onContentChange={setContent}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
            />
          </div>

          <div className="lg:col-span-1">
            <ArticleMetaSidebar
              categoryId={categoryId}
              categoryName={categoryName}
              language={language}
              content={content}
              featuredImage={featuredImage}
              isPublished={isPublished}
              onCategoryChange={handleCategoryChange}
              onLanguageChange={setLanguage}
              onFeaturedImageChange={setFeaturedImage}
              onPublishChange={setIsPublished}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
