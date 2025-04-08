
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchUserArticles, 
  FilterOptions, 
  ArticleListItem, 
  PaginationData 
} from '@/services/myArticlesService';

export const useArticles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortColumn, setSortColumn] = useState<string>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchArticles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetchUserArticles(
        user.id,
        pagination.page,
        pagination.pageSize,
        {
          ...filters,
          sortColumn,
          sortDirection
        }
      );
      
      setArticles(response.data || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load your articles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to desc
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const createDraftArticle = async () => {
    if (!user) return;
    
    setIsCreatingDraft(true);
    
    try {
      // Create a new draft article with minimal content
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: `Draft - ${new Date().toLocaleTimeString()}`,
          content: '',
          author_id: user.id,
          is_published: false,
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Return the newly created article ID
        return data[0].id;
      }
    } catch (error: any) {
      console.error('Error creating draft article:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create draft article',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDraft(false);
    }
    return null;
  };

  // Fetch articles when user, page, or sorting changes
  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user, pagination.page, sortColumn, sortDirection]);

  // Reset filters
  const clearFilters = () => {
    setFilters({});
    setPagination({ ...pagination, page: 1 });
  };

  return {
    articles,
    isLoading,
    isCreatingDraft,
    pagination,
    filters,
    sortColumn,
    sortDirection,
    handleFilterChange,
    handleSort,
    handlePageChange,
    createDraftArticle,
    clearFilters,
    hasFilters: Object.keys(filters).length > 0,
  };
};
