
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import ArticleContentEditor from "@/components/ArticleContentEditor";
import ArticleMetaSidebar from "@/components/ArticleMetaSidebar";

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Article content state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  
  // Article metadata state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [readTime, setReadTime] = useState<number>(5);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  
  const isEditing = Boolean(id);

  // Fetch article if editing
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*, categories:category_id(id, name)")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Check if current user is the author
        if (data.author_id !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this article",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Set the article content
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt || "");
        
        // Set the metadata
        setCategoryId(data.category_id);
        setCategoryName(data.category || (data.categories ? data.categories.name : ""));
        setLanguage(data.language);
        setReadTime(data.read_time || 5);
        setFeaturedImage(data.featured_image || "");
        setIsPublished(data.is_published || false);
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate, toast]);

  const handleCategoryChange = (categoryName: string, id: string | null) => {
    setCategoryName(categoryName);
    setCategoryId(id);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create or edit articles",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your article",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const articleData = {
        title,
        content,
        excerpt,
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
        response = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);
      } else {
        // Create new article
        response = await supabase
          .from("articles")
          .insert(articleData)
          .select();
      }

      if (response.error) throw response.error;

      toast({
        title: isEditing ? "Article updated" : "Article created",
        description: `Your article has been ${isEditing ? "updated" : "created"} successfully`,
      });

      if (!isEditing && response.data) {
        // Navigate to the newly created article
        navigate(`/article/edit/${response.data[0].id}`);
      }
    } catch (error: any) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} article`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;
    
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "Your article has been deleted successfully",
      });
      
      navigate("/my-articles");
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && isEditing) {
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
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          
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
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ArticleContentEditor
              initialContent={content}
              initialTitle={title}
              initialExcerpt={excerpt}
              onContentChange={setContent}
              onTitleChange={setTitle}
              onExcerptChange={setExcerpt}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ArticleMetaSidebar
              categoryId={categoryId}
              categoryName={categoryName}
              language={language}
              readTime={readTime}
              featuredImage={featuredImage}
              isPublished={isPublished}
              onCategoryChange={handleCategoryChange}
              onLanguageChange={setLanguage}
              onReadTimeChange={setReadTime}
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
