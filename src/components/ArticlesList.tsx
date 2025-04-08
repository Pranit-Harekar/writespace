
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArticleCard, ArticleProps } from '@/components/ArticleCard';
import { ArticleListItem } from '@/components/ArticleListItem';
import { ArticlesListSkeleton } from '@/components/ArticlesListSkeleton';
import { ArticlesEmptyState } from '@/components/ArticlesEmptyState';
import { fetchArticles } from '@/services/articlesService';
import { ViewSwitcher, ViewMode, getPersistedViewMode } from '@/components/ViewSwitcher';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface ArticlesListProps {
  sectionTitle?: string;
  limit?: number;
  filterByCategory?: string;
  filterByAuthor?: string;
  searchQuery?: string;
  showViewSwitcher?: boolean;
  defaultView?: ViewMode;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  sectionTitle = 'Latest Articles',
  limit = 6,
  filterByCategory,
  filterByAuthor,
  searchQuery,
  showViewSwitcher = false,
  defaultView,
}) => {
  // Use persisted view mode or passed default
  const [viewMode, setViewMode] = useState<ViewMode>(() => defaultView || getPersistedViewMode());

  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const initialLoadComplete = useRef(false);
  const prevFiltersRef = useRef({ limit, filterByCategory, filterByAuthor, searchQuery });

  const loadArticles = useCallback(
    async (pageNumber: number) => {
      setIsLoading(true);

      try {
        const { articles: fetchedArticles, hasMore: moreAvailable } = await fetchArticles({
          limit,
          filterByCategory,
          filterByAuthor,
          searchQuery,
          page: pageNumber,
        });

        setHasMore(moreAvailable);
        setArticles(fetchedArticles);
        
        // Estimate total pages
        if (pageNumber === 1) {
          setTotalPages(moreAvailable ? Math.ceil(fetchedArticles.length * 2 / limit) : 1);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, filterByCategory, filterByAuthor, searchQuery]
  );

  // Initial load - only load once when props change
  useEffect(() => {
    // Check if filters have changed
    const currentFilters = { limit, filterByCategory, filterByAuthor, searchQuery };
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
  }, [filterByCategory, filterByAuthor, searchQuery, limit, loadArticles]);

  // Generate pagination items
  const paginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          href="#" 
          isActive={page === 1} 
          onClick={(e) => { 
            e.preventDefault(); 
            if (page !== 1) {
              setPage(1);
              loadArticles(1);
            }
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
              if (page !== i) {
                setPage(i);
                loadArticles(i);
              }
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < totalPages - 2 && totalPages > 4) {
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
              if (page !== totalPages) {
                setPage(totalPages);
                loadArticles(totalPages);
              }
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return <ArticlesListSkeleton count={limit} viewMode={viewMode} />;
  }

  if (articles.length === 0) {
    return <ArticlesEmptyState filterByCategory={filterByCategory} />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        {showViewSwitcher && <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />}
      </div>

      <div className="space-y-8">
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {articles.map(article => (
              <ArticleListItem key={article.id} {...article} />
            ))}
          </div>
        )}

        {hasMore && totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) {
                        const prevPage = page - 1;
                        setPage(prevPage);
                        loadArticles(prevPage);
                      }
                    }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {paginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasMore) {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        loadArticles(nextPage);
                      }
                    }}
                    className={!hasMore ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};
