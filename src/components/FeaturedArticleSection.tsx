
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleProps } from "@/components/ArticleCard";

export const FeaturedArticleSection = () => {
  const { toast } = useToast();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      try {
        const { data, error } = await supabase
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
          .not("featured_image", "is", null)
          .order("published_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          // If no featured article with image is found, try to find any article
          const { data: fallbackData, error: fallbackError } = await supabase
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
            .order("published_at", { ascending: false })
            .limit(1)
            .single();

          if (fallbackError) throw fallbackError;
          
          const formattedArticle = {
            id: fallbackData.id,
            title: fallbackData.title,
            excerpt: fallbackData.excerpt || "",
            author: {
              id: fallbackData.profiles.id,
              name: fallbackData.profiles.full_name || fallbackData.profiles.username || "Anonymous",
              profileImage: fallbackData.profiles.avatar_url || undefined,
            },
            publishedAt: fallbackData.published_at || "",
            category: fallbackData.category || "Uncategorized",
            language: fallbackData.language,
            readTime: fallbackData.read_time || 5,
            featuredImage: fallbackData.featured_image || undefined,
          };
          
          setArticle(formattedArticle);
        } else {
          // Format the featured article with image
          const formattedArticle = {
            id: data.id,
            title: data.title,
            excerpt: data.excerpt || "",
            author: {
              id: data.profiles.id,
              name: data.profiles.full_name || data.profiles.username || "Anonymous",
              profileImage: data.profiles.avatar_url || undefined,
            },
            publishedAt: data.published_at || "",
            category: data.category || "Uncategorized",
            language: data.language,
            readTime: data.read_time || 5,
            featuredImage: data.featured_image || undefined,
          };
          
          setArticle(formattedArticle);
        }
      } catch (error: any) {
        console.error("Error fetching featured article:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load featured article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticle();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden h-64 mb-8 animate-pulse">
        <div className="grid md:grid-cols-5 h-full">
          <div className="md:col-span-3 p-6">
            <div className="bg-muted h-4 mb-2 rounded w-1/4"></div>
            <div className="bg-muted h-8 mb-4 rounded w-3/4"></div>
            <div className="bg-muted h-20 rounded"></div>
          </div>
          <div className="md:col-span-2 bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return <FeaturedArticle {...article} />;
};
