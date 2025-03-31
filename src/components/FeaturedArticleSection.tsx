import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleProps } from '@/components/ArticleCard';
import { extractExcerpt } from '@/lib/textUtils';

export const FeaturedArticleSection = () => {
  const { toast } = useToast();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      try {
        // First try to find an article with an image
        const { data: featuredArticleData, error: featuredError } = await supabase
          .from('articles')
          .select(
            `
            id,
            title,
            subtitle,
            content,
            category,
            category_id,
            categories:category_id(id, name),
            language,
            read_time,
            featured_image,
            published_at,
            author_id
          `,
          )
          .eq('is_published', true)
          .not('featured_image', 'is', null)
          .order('published_at', { ascending: false })
          .limit(1)
          .single();

        // If no featured article with image found, try to find any article
        if (featuredError) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('articles')
            .select(
              `
              id,
              title,
              subtitle,
              content,
              category,
              category_id,
              categories:category_id(id, name),
              language,
              read_time,
              featured_image,
              published_at,
              author_id
            `,
            )
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(1)
            .single();

          if (fallbackError) throw fallbackError;

          // Now get the author profile
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', fallbackData.author_id)
            .single();

          if (authorError) {
            console.warn('Author profile not found:', authorError);
            
            // Get category name from the categories relation or fall back to the category field
            const categoryName = fallbackData.categories
              ? fallbackData.categories.name
              : fallbackData.category || 'Uncategorized';

            // Use explicit subtitle or generate from content
            const excerptText = fallbackData.subtitle?.trim()
              ? fallbackData.subtitle
              : extractExcerpt(fallbackData.content);

            const formattedArticle = {
              id: fallbackData.id,
              title: fallbackData.title,
              excerpt: excerptText,
              author: {
                id: fallbackData.author_id,
                name: 'Anonymous',
                profileImage: undefined,
              },
              publishedAt: fallbackData.published_at || '',
              category: categoryName,
              language: fallbackData.language,
              readTime: fallbackData.read_time || 5,
              featuredImage: fallbackData.featured_image || undefined,
            };

            setArticle(formattedArticle);
          } else {
            // Format the article with author details

            // Get category name from the categories relation or fall back to the category field
            const categoryName = fallbackData.categories
              ? fallbackData.categories.name
              : fallbackData.category || 'Uncategorized';

            // Use explicit subtitle or generate from content
            const excerptText = fallbackData.subtitle?.trim()
              ? fallbackData.subtitle
              : extractExcerpt(fallbackData.content);

            const formattedArticle = {
              id: fallbackData.id,
              title: fallbackData.title,
              excerpt: excerptText,
              author: {
                id: authorData.id,
                name: authorData.full_name || authorData.username || 'Anonymous',
                profileImage: authorData.avatar_url || undefined,
              },
              publishedAt: fallbackData.published_at || '',
              category: categoryName,
              language: fallbackData.language,
              readTime: fallbackData.read_time || 5,
              featuredImage: fallbackData.featured_image || undefined,
            };

            setArticle(formattedArticle);
          }
        } else {
          // We have a featured article with image, now get the author profile
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', featuredArticleData.author_id)
            .single();

          if (authorError) {
            console.warn('Author profile not found:', authorError);

            // Get category name from the categories relation or fall back to the category field
            const categoryName = featuredArticleData.categories
              ? featuredArticleData.categories.name
              : featuredArticleData.category || 'Uncategorized';

            // Use explicit subtitle or generate from content
            const excerptText = featuredArticleData.subtitle?.trim()
              ? featuredArticleData.subtitle
              : extractExcerpt(featuredArticleData.content);

            // Create a formatted article without author details
            const formattedArticle = {
              id: featuredArticleData.id,
              title: featuredArticleData.title,
              excerpt: excerptText,
              author: {
                id: featuredArticleData.author_id,
                name: 'Anonymous',
                profileImage: undefined,
              },
              publishedAt: featuredArticleData.published_at || '',
              category: categoryName,
              language: featuredArticleData.language,
              readTime: featuredArticleData.read_time || 5,
              featuredImage: featuredArticleData.featured_image || undefined,
            };

            setArticle(formattedArticle);
          } else {
            // Get category name from the categories relation or fall back to the category field
            const categoryName = featuredArticleData.categories
              ? featuredArticleData.categories.name
              : featuredArticleData.category || 'Uncategorized';

            // Use explicit subtitle or generate from content
            const excerptText = featuredArticleData.subtitle?.trim()
              ? featuredArticleData.subtitle
              : extractExcerpt(featuredArticleData.content);

            // Format the featured article with author details
            const formattedArticle = {
              id: featuredArticleData.id,
              title: featuredArticleData.title,
              excerpt: excerptText,
              author: {
                id: authorData.id,
                name: authorData.full_name || authorData.username || 'Anonymous',
                profileImage: authorData.avatar_url || undefined,
              },
              publishedAt: featuredArticleData.published_at || '',
              category: categoryName,
              language: featuredArticleData.language,
              readTime: featuredArticleData.read_time || 5,
              featuredImage: featuredArticleData.featured_image || undefined,
            };

            setArticle(formattedArticle);
          }
        }
      } catch (error: unknown) {
        console.error('Error fetching featured article:', error);
        if (error['code'] === 'PGRST116') {
          toast({
            title: 'Oops!',
            description: 'No published articles found. Please check back later!',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Error',
            description: error['message'] || 'Failed to load featured article',
            variant: 'destructive',
          });
        }
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
