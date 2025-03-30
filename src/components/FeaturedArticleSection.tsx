
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
        // First try to find an article with an image
        const { data: featuredArticleData, error: featuredError } = await supabase
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
          .not("featured_image", "is", null)
          .order("published_at", { ascending: false })
          .limit(1)
          .single();

        // If no featured article with image found, try to find any article
        if (featuredError) {
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
              author_id
            `)
            .eq("is_published", true)
            .order("published_at", { ascending: false })
            .limit(1)
            .single();

          if (fallbackError) throw fallbackError;
          
          // Now get the author profile
          const { data: authorData, error: authorError } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .eq("id", fallbackData.author_id)
            .single();

          if (authorError) {
            console.warn("Author profile not found:", authorError);
            // Create a formatted article without author details
            const formattedArticle = {
              id: fallbackData.id,
              title: fallbackData.title,
              excerpt: fallbackData.excerpt || "",
              author: {
                id: fallbackData.author_id,
                name: "Anonymous",
                profileImage: undefined,
              },
              publishedAt: fallbackData.published_at || "",
              category: fallbackData.category || "Uncategorized",
              language: fallbackData.language,
              readTime: fallbackData.read_time || 5,
              featuredImage: fallbackData.featured_image || undefined,
            };
            
            setArticle(formattedArticle);
          } else {
            // Format the article with author details
            const formattedArticle = {
              id: fallbackData.id,
              title: fallbackData.title,
              excerpt: fallbackData.excerpt || "",
              author: {
                id: authorData.id,
                name: authorData.full_name || authorData.username || "Anonymous",
                profileImage: authorData.avatar_url || undefined,
              },
              publishedAt: fallbackData.published_at || "",
              category: fallbackData.category || "Uncategorized",
              language: fallbackData.language,
              readTime: fallbackData.read_time || 5,
              featuredImage: fallbackData.featured_image || undefined,
            };
            
            setArticle(formattedArticle);
          }
        } else {
          // We have a featured article with image, now get the author profile
          const { data: authorData, error: authorError } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .eq("id", featuredArticleData.author_id)
            .single();

          if (authorError) {
            console.warn("Author profile not found:", authorError);
            // Create a formatted article without author details
            const formattedArticle = {
              id: featuredArticleData.id,
              title: featuredArticleData.title,
              excerpt: featuredArticleData.excerpt || "",
              author: {
                id: featuredArticleData.author_id,
                name: "Anonymous",
                profileImage: undefined,
              },
              publishedAt: featuredArticleData.published_at || "",
              category: featuredArticleData.category || "Uncategorized",
              language: featuredArticleData.language,
              readTime: featuredArticleData.read_time || 5,
              featuredImage: featuredArticleData.featured_image || undefined,
            };
            
            setArticle(formattedArticle);
          } else {
            // Format the featured article with author details
            const formattedArticle = {
              id: featuredArticleData.id,
              title: featuredArticleData.title,
              excerpt: featuredArticleData.excerpt || "",
              author: {
                id: authorData.id,
                name: authorData.full_name || authorData.username || "Anonymous",
                profileImage: authorData.avatar_url || undefined,
              },
              publishedAt: featuredArticleData.published_at || "",
              category: featuredArticleData.category || "Uncategorized",
              language: featuredArticleData.language,
              readTime: featuredArticleData.read_time || 5,
              featuredImage: featuredArticleData.featured_image || undefined,
            };
            
            setArticle(formattedArticle);
          }
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
