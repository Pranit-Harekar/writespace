
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArticleProps } from '@/components/ArticleCard';
import { extractExcerpt } from '@/lib/textUtils';
import { useCallback, useState } from 'react';

export const useFeaturedArticlesService = () => {
  const { toast } = useToast();

  const fetchFeaturedArticles = useCallback(async (): Promise<ArticleProps[]> => {
    try {
      // Get simple featured articles (most recent)
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(
          `
          id,
          title,
          subtitle,
          content,
          category,
          category_id,
          categories:category_id(name),
          read_time,
          featured_image,
          published_at,
          author_id
        `
        )
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (articlesError) throw articlesError;

      // If no articles found, return early
      if (!articlesData || articlesData.length === 0) {
        return [];
      }

      // Extract author_ids to fetch profiles in a single request
      const authorIds = [...new Set(articlesData.map(article => article.author_id))];

      // Fetch author profiles in a single request
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', authorIds);

      if (profilesError) throw profilesError;

      // Create a lookup map for profiles
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Transform data to match ArticleProps
      const formattedArticles = articlesData.map(item => {
        const profile = profileMap.get(item.author_id) || {
          id: item.author_id,
          username: 'Anonymous',
          full_name: null,
          avatar_url: null,
        };

        // Get category name from the categories relation or fall back to the category field
        const categoryName = item.categories ? item.categories.name : item.category;

        // Use explicit subtitle or generate from content
        const excerptText = item.subtitle?.trim() ? item.subtitle : extractExcerpt(item.content);

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
          likesCount: 0,
          commentsCount: 0,
        };
      });

      return formattedArticles;
    } catch (error: unknown) {
      console.error('Error fetching featured articles:', error);
      toast({
        title: 'Error',
        description: error['message'] || 'Failed to load featured articles',
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  return { fetchFeaturedArticles };
};

// Add a new hook that uses the service for simpler consumption
export const useFeaturedArticles = (limit: number = 5) => {
  const [data, setData] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { fetchFeaturedArticles } = useFeaturedArticlesService();
  
  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const articles = await fetchFeaturedArticles();
      setData(articles.slice(0, limit));
    } catch (err) {
      console.error('Error loading featured articles:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFeaturedArticles, limit]);
  
  return { data, isLoading, error, loadArticles };
};
