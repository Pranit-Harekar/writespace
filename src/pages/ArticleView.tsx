
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Pencil, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Article {
  id: string;
  title: string;
  content: string;
  subtitle: string | null;
  author_id: string;
  category: string | null;
  category_id: string | null;
  categories: {
    id: string;
    name: string;
  } | null;
  language: string;
  read_time: number | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Author {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const ArticleView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        // Fetch article
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select(`
            *,
            categories:category_id(id, name)
          `)
          .eq("id", id)
          .maybeSingle();

        if (articleError) throw articleError;
        
        if (!articleData) {
          toast({
            title: "Article not found",
            description: "The article you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        // Check if article is published or if user is the author
        if (!articleData.is_published && (!user || user.id !== articleData.author_id)) {
          toast({
            title: "Article not available",
            description: "This article is not published",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setArticle(articleData);
        
        // Fetch author profile
        const { data: authorData, error: authorError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .eq("id", articleData.author_id)
          .single();

        if (authorError) throw authorError;
        
        setAuthor(authorData);
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load article",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!article || !author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
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
          
          {user && user.id === article.author_id && (
            <Button asChild>
              <Link to={`/article/edit/${article.id}`}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Article
              </Link>
            </Button>
          )}
        </div>

        <article className="max-w-4xl mx-auto">
          {article.featured_image && (
            <div className="w-full h-80 overflow-hidden rounded-lg mb-8">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {(article.categories?.name || article.category) && (
              <Badge variant="outline">
                {article.categories?.name || article.category}
              </Badge>
            )}
            <Badge variant="secondary">{article.language === 'en' ? 'English' : article.language}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
          
          {article.subtitle && (
            <p className="text-xl text-gray-500 mb-6">{article.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <Avatar>
              <AvatarImage src={author.avatar_url || undefined} alt={author.full_name || author.username || ""} />
              <AvatarFallback>{author.full_name?.charAt(0) || author.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {author.full_name || author.username || "Anonymous"}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </span>
                {article.read_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.read_time} min read
                  </span>
                )}
              </div>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticleView;
