
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { extractExcerpt } from '@/lib/textUtils';
import { ArticleProps } from '@/components/ArticleCard';

export interface ArticlesQueryParams {
  limit?: number;
  filterByCategory?: string;
  filterByAuthor?: string;
  searchQuery?: string;
  page?: number;
  includeDrafts?: boolean;
}

export const fetchArticles = async (
  params: ArticlesQueryParams
): Promise<{
  articles: ArticleProps[];
  hasMore: boolean;
}> => {
  const { 
    limit = 6, 
    filterByCategory, 
    filterByAuthor, 
    searchQuery, 
    page = 1,
    includeDrafts = false 
  } = params;

  try {
    // Calculate offset based on page number and limit
    const offset = (page - 1) * limit;

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
        author_id,
        is_published
      `
      );
    
    // Only include published articles unless explicitly requested to show drafts
    if (!includeDrafts) {
      query = query.eq('is_published', true);
    }
    
    query = query.order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,subtitle.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
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

    // If author filter is provided
    if (filterByAuthor) {
      query = query.eq('author_id', filterByAuthor);
    }

    const { data: articlesData, error: articlesError } = await query;

    if (articlesError) throw articlesError;

    // Check if there are more articles to load
    const hasMore = articlesData.length === limit;

    // If no articles found, return early
    if (!articlesData || articlesData.length === 0) {
      return { articles: [], hasMore: false };
    }

    // Extract article_ids for batch fetching engagement metrics
    const articleIds = articlesData.map(article => article.id);

    // Fetch author_ids to get profiles in a single batch
    const authorIds = [...new Set(articlesData.map(article => article.author_id))];

    // Batch fetch author profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds);

    if (profilesError) throw profilesError;

    // Fetch all likes for these articles
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

    // Create profiles lookup map
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
        likesCount: likesCountMap.get(item.id) || 0,
        commentsCount: commentsCountMap.get(item.id) || 0,
        isDraft: !item.is_published,
      };
    });

    return { articles: formattedArticles, hasMore };
  } catch (error: unknown) {
    console.error('Error fetching articles:', error);
    toast({
      title: 'Error',
      description: error['message'] || 'Failed to load articles',
      variant: 'destructive',
    });
    return { articles: [], hasMore: false };
  }
};
