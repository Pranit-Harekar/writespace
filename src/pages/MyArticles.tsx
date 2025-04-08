
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Eye, SortAsc, SortDesc } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { fetchUserArticles, FilterOptions, ArticleListItem, PaginationData } from '@/services/myArticlesService';
import { ArticlesFilter } from '@/components/ArticlesFilter';
import { supabase } from '@/integrations/supabase/client';

const MyArticles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    fetchArticles();
  }, [user, pagination.page, sortColumn, sortDirection]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
    fetchArticles();
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
        // Navigate to the edit page for the newly created draft
        navigate(`/article/edit/${data[0].id}`);
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
  };

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const { page, totalPages } = pagination;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          href="#" 
          isActive={page === 1} 
          onClick={(e) => { 
            e.preventDefault(); 
            setPagination({ ...pagination, page: 1 });
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i <= 1 || i >= totalPages) continue; // Skip first and last page as they're always shown
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={page === i} 
            onClick={(e) => { 
              e.preventDefault(); 
              setPagination({ ...pagination, page: i });
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            href="#" 
            isActive={page === totalPages} 
            onClick={(e) => { 
              e.preventDefault(); 
              setPagination({ ...pagination, page: totalPages });
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }, [pagination]);

  if (isLoading && pagination.page === 1) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="inline ml-1 h-4 w-4" /> : 
      <SortDesc className="inline ml-1 h-4 w-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Articles</h1>
          <Button onClick={createDraftArticle} disabled={isCreatingDraft}>
            <Plus className="h-4 w-4 mr-2" /> 
            {isCreatingDraft ? 'Creating Draft...' : 'Create New Article'}
          </Button>
        </div>

        <ArticlesFilter onFilterChange={handleFilterChange} initialFilters={filters} />

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">
              {Object.keys(filters).length > 0 
                ? "No articles match your filters" 
                : "You haven't created any articles yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {Object.keys(filters).length > 0 
                ? "Try adjusting your filters to see more results"
                : "Start writing and sharing your knowledge with the community"}
            </p>
            {Object.keys(filters).length > 0 ? (
              <Button variant="outline" onClick={() => handleFilterChange({})}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={createDraftArticle} disabled={isCreatingDraft}>
                {isCreatingDraft ? 'Creating Draft...' : 'Create Your First Article'}
              </Button>
            )}
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>
                {pagination.total > 0 && `Showing ${articles.length} of ${pagination.total} articles`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[300px] cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Title {getSortIcon('title')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category {getSortIcon('category')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('updated_at')}
                  >
                    Last Updated {getSortIcon('updated_at')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.category_name || article.category || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={article.is_published ? 'default' : 'outline'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/article/${article.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/article/edit/${article.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) {
                            setPagination({ ...pagination, page: pagination.page - 1 });
                          }
                        }}
                        className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {paginationItems}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) {
                            setPagination({ ...pagination, page: pagination.page + 1 });
                          }
                        }}
                        className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
