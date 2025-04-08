
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ArticleListItem {
  id: string;
  title: string;
  category: string | null;
  category_id: string | null;
  category_name?: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
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
  title?: string | null;
  category?: string | null;
  status?: 'published' | 'draft' | null;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export const fetchUserArticles = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  filters: FilterOptions = {}
): Promise<ArticlesResponse> => {
  try {
    const { data, error } = await supabase.rpc('get_user_articles', {
      user_id_param: userId,
      page_param: page,
      page_size_param: pageSize,
      filter_title: filters.title || null,
      filter_category: filters.category || null,
      filter_status: filters.status || null,
      sort_column: filters.sortColumn || 'updated_at',
      sort_direction: filters.sortDirection || 'desc',
    });

    if (error) throw error;

    return data as ArticlesResponse;
  } catch (error: any) {
    console.error('Error fetching user articles:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    };
  }
};
