import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ArticlesEmptyState } from '@/components/ArticlesEmptyState';

interface ArticleListItem {
  id: string;
  title: string;
  category: string | null;
  category_id: string | null;
  categories: {
    id: string;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

const MyArticles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        // First get the total count for pagination
        const { count, error: countError } = await supabase
          .from('articles')
          .select('id', { count: 'exact' })
          .eq('author_id', user.id);

        if (countError) throw countError;

        // Calculate total pages
        const totalItems = count || 0;
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        setTotalPages(calculatedTotalPages);

        // Adjust current page if it's out of bounds
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(1);
        }

        // Calculate pagination range
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data, error } = await supabase
          .from('articles')
          .select(
            `
            id,
            title,
            category,
            category_id,
            categories:category_id(id, name),
            created_at,
            updated_at,
            is_published
          `
          )
          .eq('author_id', user.id)
          .order('updated_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        setArticles(data || []);
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

    fetchArticles();
  }, [user, navigate, toast, currentPage]);

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

  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Calculate which pages to show
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('ellipsis');
        }
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add last page and ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('ellipsis');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const actions = articleId => {
    return (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/article/${articleId}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link to={`/article/edit/${articleId}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Articles</h1>
          <Button onClick={createDraftArticle} disabled={isCreatingDraft}>
            <Plus className="h-4 w-4" />
            {isCreatingDraft ? 'Creating Draft...' : 'Create New Article'}
          </Button>
        </div>

        {articles.length === 0 ? (
          <ArticlesEmptyState filterByCategory="" />
        ) : (
          <>
            <Table>
              <TableCaption>
                Page {currentPage} of {totalPages}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <Link to={`/article/${article.id}`}>{article.title}</Link>
                    </TableCell>
                    <TableCell>{article.categories?.name || article.category || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={article.is_published ? 'default' : 'outline'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{actions(article.id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={
                        currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(Number(pageNum))}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {/* Next button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
