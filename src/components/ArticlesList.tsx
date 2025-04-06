import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArticleCard, ArticleProps } from '@/components/ArticleCard';
import { ArticlesListSkeleton } from '@/components/ArticlesListSkeleton';
import { ArticlesEmptyState } from '@/components/ArticlesEmptyState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { fetchArticles } from '@/services/articlesService';

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
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const initialLoadComplete = useRef(false);
  const prevFiltersRef = useRef({ limit, filterByCategory, searchQuery });

  const loadArticles = useCallback(
    async (pageNumber: number, isLoadMore = false) => {
      const loadingState = isLoadMore ? setIsLoadingMore : setIsLoading;
      loadingState(true);

      try {
        const { articles: fetchedArticles, hasMore: moreAvailable } = await fetchArticles({
          limit,
          filterByCategory,
          searchQuery,
          page: pageNumber,
        });

        setHasMore(moreAvailable);

        // If loading more, append to existing articles, otherwise replace
        if (isLoadMore) {
          setArticles(prev => [...prev, ...fetchedArticles]);
        } else {
          setArticles(fetchedArticles);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        loadingState(false);
      }
    },
    [limit, filterByCategory, searchQuery]
  );

  // Initial load - only load once when props change
  useEffect(() => {
    // Check if filters have changed
    const currentFilters = { limit, filterByCategory, searchQuery };
    const filtersChanged =
      JSON.stringify(currentFilters) !== JSON.stringify(prevFiltersRef.current);

    if (filtersChanged || !initialLoadComplete.current) {
      // Reset pagination and loading state when filters change
      setPage(1);
      setIsLoading(true);
      initialLoadComplete.current = false;
      prevFiltersRef.current = currentFilters;

      // Load the first page of articles
      loadArticles(1);
      initialLoadComplete.current = true;
    }
  }, [filterByCategory, searchQuery, limit, loadArticles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadArticles(nextPage, true);
  };

  if (isLoading) {
    return <ArticlesListSkeleton count={limit} />;
  }

  if (articles.length === 0) {
    return <ArticlesEmptyState filterByCategory={filterByCategory} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {hasMore && <LoadMoreButton isLoading={isLoadingMore} onClick={handleLoadMore} />}
    </div>
  );
};
