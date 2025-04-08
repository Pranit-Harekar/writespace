import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArticlesTable } from '@/components/ArticlesTable';
import { ArticlesEmptyState } from '@/components/ArticlesEmptyState';
import { ArticlesPagination } from '@/components/ArticlesPagination';
import { useArticles } from '@/hooks/use-articles';

const MyArticles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    articles,
    isLoading,
    isCreatingDraft,
    pagination,
    sortColumn,
    sortDirection,
    hasFilters,
    handleSort,
    handlePageChange,
    createDraftArticle,
    clearFilters,
  } = useArticles();

  // Handle create draft and navigate
  const handleCreateDraft = async () => {
    const newArticleId = await createDraftArticle();
    if (newArticleId) {
      navigate(`/article/edit/${newArticleId}`);
    }
  };

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Articles</h1>
          <Button onClick={handleCreateDraft} disabled={isCreatingDraft}>
            <Plus className="h-4 w-4 mr-2" />
            {isCreatingDraft ? 'Creating Draft...' : 'Create New Article'}
          </Button>
        </div>

        {articles.length === 0 ? (
          <ArticlesEmptyState
            hasFilters={hasFilters}
            isCreatingDraft={isCreatingDraft}
            onClearFilters={clearFilters}
            onCreateDraft={handleCreateDraft}
          />
        ) : (
          <>
            <ArticlesTable
              articles={articles}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              handleSort={handleSort}
              total={pagination.total}
            />
            <ArticlesPagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
