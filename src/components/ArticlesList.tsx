
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleCard, ArticleProps } from "@/components/ArticleCard";

interface ArticlesListProps {
  limit?: number;
  filterByCategory?: string;
  filterByLanguage?: string;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  limit = 6,
  filterByCategory,
  filterByLanguage,
}) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Start building the query
        let query = supabase
          .from("articles")
          .select(`
            id, 
            title, 
            excerpt, 
            category, 
            language, 
            read_time, 
            featured_image,
            published_at,
            profiles:author_id (
              id, 
              username, 
              full_name, 
              avatar_url
            )
          `)
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        // Apply filters if provided
        if (filterByCategory) {
          query = query.eq("category", filterByCategory);
        }

        if (filterByLanguage) {
          query = query.eq("language", filterByLanguage);
        }

        // Apply limit
        query = query.limit(limit);

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to match ArticleProps
        const formattedArticles = data.map((item) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || "",
          author: {
            id: item.profiles.id,
            name: item.profiles.full_name || item.profiles.username || "Anonymous",
            profileImage: item.profiles.avatar_url || undefined,
          },
          publishedAt: item.published_at || "",
          category: item.category || "Uncategorized",
          language: item.language,
          readTime: item.read_time || 5,
          featuredImage: item.featured_image || undefined,
        }));

        setArticles(formattedArticles);
      } catch (error: any) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load articles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [filterByCategory, filterByLanguage, limit, toast]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(limit)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 h-64 animate-pulse"
            >
              <div className="bg-muted h-1/3 mb-4 rounded"></div>
              <div className="bg-muted h-4 mb-2 rounded w-3/4"></div>
              <div className="bg-muted h-4 mb-4 rounded w-1/2"></div>
              <div className="bg-muted h-20 rounded"></div>
            </div>
          ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">No articles found</h2>
        <p className="text-muted-foreground">
          {filterByCategory || filterByLanguage
            ? "Try changing your filters or check back later."
            : "Check back later for new content."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
};
