import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleCard, ArticleProps } from "@/components/ArticleCard";

interface ArticlesListProps {
  limit?: number;
  filterByCategory?: string;
  filterByLanguage?: string;
  searchQuery?: string;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  limit = 6,
  filterByCategory,
  filterByLanguage,
  searchQuery,
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
            author_id
          `)
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        // Apply search filter if provided
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }

        // Apply category filter if provided
        if (filterByCategory) {
          query = query.eq("category", filterByCategory);
        }

        // Apply language filter if provided
        if (filterByLanguage) {
          query = query.eq("language", filterByLanguage);
        }

        // Apply limit
        query = query.limit(limit);

        const { data: articlesData, error: articlesError } = await query;

        if (articlesError) throw articlesError;

        // If no articles found, return early
        if (!articlesData || articlesData.length === 0) {
          setArticles([]);
          setIsLoading(false);
          return;
        }

        // Extract author_ids to fetch profiles
        const authorIds = [...new Set(articlesData.map(article => article.author_id))];

        // Fetch author profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", authorIds);

        if (profilesError) throw profilesError;

        // Create a lookup map for profiles
        const profileMap = new Map();
        profilesData?.forEach(profile => {
          profileMap.set(profile.id, profile);
        });

        // Transform data to match ArticleProps
        const formattedArticles = articlesData.map((item) => {
          const profile = profileMap.get(item.author_id) || { 
            id: item.author_id, 
            username: 'Anonymous', 
            full_name: null, 
            avatar_url: null 
          };

          return {
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || "",
            author: {
              id: profile.id,
              name: profile.full_name || profile.username || "Anonymous",
              profileImage: profile.avatar_url || undefined,
            },
            publishedAt: item.published_at || "",
            category: item.category || "Uncategorized",
            language: item.language,
            readTime: item.read_time || 5,
            featuredImage: item.featured_image || undefined,
          };
        });

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
  }, [filterByCategory, filterByLanguage, limit, searchQuery, toast]);

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
