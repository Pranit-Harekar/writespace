
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArticleCard, ArticleProps } from '@/components/ArticleCard';
import { extractExcerpt } from '@/lib/textUtils';

interface ArticlesListProps {
  limit?: number;
  filterByCategory?: string;
  searchQuery?: string;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  limit = 6,
  filterByCategory,
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
          .order('published_at', { ascending: false });

        // Apply search filter if provided
        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,subtitle.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`,
          );
        }

        // If category filter is provided
        if (filterByCategory) {
          // First, try to get the category ID from the name
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', filterByCategory)
            .single();

          if (categoryError) {
            // Fall back to the category column if no match in categories table
            query = query.ilike('category', filterByCategory);
          } else if (categoryData) {
            // Use the category_id if we found a match
            query = query.eq('category_id', categoryData.id);
          }
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
        const authorIds = [...new Set(articlesData.map((article) => article.author_id))];

        // Fetch author profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', authorIds);

        if (profilesError) throw profilesError;

        // Get likes and comments counts for each article
        const articleIds = articlesData.map(article => article.id);
        
        // Count likes for each article
        const likesCountMap = new Map();
        for (const articleId of articleIds) {
          const { count, error } = await supabase
            .from('article_likes')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId);
            
          if (error) throw error;
          likesCountMap.set(articleId, count || 0);
        }
        
        // Count comments for each article
        const commentsCountMap = new Map();
        for (const articleId of articleIds) {
          const { count, error } = await supabase
            .from('article_comments')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId);
            
          if (error) throw error;
          commentsCountMap.set(articleId, count || 0);
        }

        // Create a lookup map for profiles
        const profileMap = new Map();
        profilesData?.forEach((profile) => {
          profileMap.set(profile.id, profile);
        });

        // Transform data to match ArticleProps
        const formattedArticles = articlesData.map((item) => {
          const profile = profileMap.get(item.author_id) || {
            id: item.author_id,
            username: 'Anonymous',
            full_name: null,
            avatar_url: null,
          };

          // Get category name from the categories relation or fall back to the category field
          const categoryName = item.categories ? item.categories.name : item.category;

          // Use explicit subtitle or generate from content
          const excerptText = item.subtitle?.trim() 
            ? item.subtitle 
            : extractExcerpt(item.content);

          return {
            id: item.id,
            title: item.title,
            excerpt: excerptText,
            author: {
              id: profile.id,
              name: profile.full_name || profile.username || 'Anonymous',
              profileImage: profile.avatar_url || undefined,
            },
            publishedAt: item.published_at || '',
            category: categoryName || 'Uncategorized',
            readTime: item.read_time || 5,
            featuredImage: item.featured_image || undefined,
            likesCount: likesCountMap.get(item.id) || 0,
            commentsCount: commentsCountMap.get(item.id) || 0,
          };
        });

        setArticles(formattedArticles);
      } catch (error: unknown) {
        console.error('Error fetching articles:', error);
        toast({
          title: 'Error',
          description: error['message'] || 'Failed to load articles',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [filterByCategory, limit, searchQuery, toast]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(limit)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="border rounded-lg p-4 h-64 animate-pulse">
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
          {filterByCategory
            ? 'Try changing your filters or check back later.'
            : 'Check back later for new content.'}
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
