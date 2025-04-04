
import React, { useState, useEffect } from 'react';
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

  const loadArticles = async (pageNumber: number, isLoadMore = false) => {
    const loadingState = isLoadMore ? setIsLoadingMore : setIsLoading;
    loadingState(true);
    
    const { articles: fetchedArticles, hasMore: moreAvailable } = await fetchArticles({
      limit,
      filterByCategory,
      searchQuery,
      page: pageNumber
    });
    
    setHasMore(moreAvailable);
    
    // If loading more, append to existing articles, otherwise replace
    if (isLoadMore) {
      setArticles(prev => [...prev, ...fetchedArticles]);
    } else {
      setArticles(fetchedArticles);
    }
    
    loadingState(false);
  };

  // Initial load
  useEffect(() => {
    setPage(1);
    loadArticles(1);
  }, [filterByCategory, limit, searchQuery]);

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
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
      
      {hasMore && (
        <LoadMoreButton 
          isLoading={isLoadingMore} 
          onClick={handleLoadMore} 
        />
      )}
    </div>
  );
};
