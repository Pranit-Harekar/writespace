import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArticleProps } from '@/components/ArticleCard';
import { extractExcerpt } from '@/lib/textUtils';
import { useCallback, useState, useEffect } from 'react';

export const useFeaturedArticlesService = () => {
  const { toast } = useToast();

  const fetchFeaturedArticles = useCallback(async (): Promise<ArticleProps[]> => {
    try {
      // Get articles with highest combined likes and comments count (top 5)
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
          categories:category_id(id, name),
          read_time,
          featured_image,
          published_at,
          author_id
        `
        )
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(15); // Fetch more than needed to ensure we have enough after filtering

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

      // Get likes and comments counts for each article in batch requests
      const articleIds = articlesData.map(article => article.id);

      // Fetch likes for all articles
      const { data: likesData, error: likesError } = await supabase
        .from('article_likes')
        .select('article_id')
        .in('article_id', articleIds);

      if (likesError) throw likesError;

      // Count likes per article using client-side JavaScript
      const likesCountMap = new Map();
      articleIds.forEach(articleId => {
        const articleLikes = likesData?.filter(like => like.article_id === articleId) || [];
        likesCountMap.set(articleId, articleLikes.length);
      });

      // Fetch comments for all articles
      const { data: commentsData, error: commentsError } = await supabase
        .from('article_comments')
        .select('article_id')
        .in('article_id', articleIds);

      if (commentsError) throw commentsError;

      // Count comments per article using client-side JavaScript
      const commentsCountMap = new Map();
      articleIds.forEach(articleId => {
        const articleComments =
          commentsData?.filter(comment => comment.article_id === articleId) || [];
        commentsCountMap.set(articleId, articleComments.length);
      });

      // Create a lookup map for profiles
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Transform data to match ArticleProps and add engagement score
      const articlesWithMetrics = articlesData.map(item => {
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

        // Get engagement metrics
        const likesCount = likesCountMap.get(item.id) || 0;
        const commentsCount = commentsCountMap.get(item.id) || 0;

        // Calculate an engagement score (likes + comments)
        const engagementScore = likesCount + commentsCount;

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
          likesCount,
          commentsCount,
          engagementScore, // Add engagement score
        };
      });

      // Sort by engagement score and take top 5
      const topArticles = articlesWithMetrics
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 5);

      return topArticles;
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
export const useFeaturedArticles = (limit: number, shouldFetch: boolean = true) => {
  const { toast } = useToast();
  const [data, setData] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { fetchFeaturedArticles } = useFeaturedArticlesService();
  
  useEffect(() => {
    if (!shouldFetch) return;
    
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const articles = await fetchFeaturedArticles();
        setData(articles.slice(0, limit));
      } catch (err) {
        console.error('Error loading featured articles:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to load featured articles',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, [fetchFeaturedArticles, limit, shouldFetch, toast]);
  
  return { data, isLoading, error };
};
