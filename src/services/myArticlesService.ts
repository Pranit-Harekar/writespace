
import { supabase } from '@/integrations/supabase/client';

export interface ArticleListItem {
  id: string;
  title: string;
  category?: string;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  isPublished: boolean;
  views?: number;
  likes?: number;
  comments?: number;
}

export interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ArticlesResponse {
  data: ArticleListItem[];
  pagination: PaginationData;
}

export interface FilterOptions {
  title?: string;
  category?: string;
  status?: 'published' | 'draft' | '';
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

// Function to fetch user articles with pagination and filters
export const fetchUserArticles = async (
  userId: string,
  page: number = 1,
  pageSize: number = 6,
  filters: FilterOptions = {}
): Promise<ArticlesResponse> => {
  try {
    const { title, category, status, sortColumn = 'updated_at', sortDirection = 'desc' } = filters;

    // Call the database function with all parameters
    const { data, error } = await supabase.rpc('get_user_articles', {
      user_id_param: userId,
      page_param: page,
      page_size_param: pageSize,
      filter_title: title || null,
      filter_category: category || null,
      filter_status: status || null,
      sort_column: sortColumn,
      sort_direction: sortDirection,
    });

    if (error) throw error;

    // Cast the data to the ArticlesResponse type after checking it has the expected structure
    if (
      data && 
      typeof data === 'object' && 
      'data' in data && 
      'pagination' in data
    ) {
      return data as unknown as ArticlesResponse;
    }

    // If data doesn't match expected structure, return a default response
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};
