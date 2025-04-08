
import React, { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { PaginationData } from '@/services/myArticlesService';

interface ArticlesPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const ArticlesPagination: React.FC<ArticlesPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages } = pagination;

  const paginationItems = useMemo(() => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          href="#" 
          isActive={page === 1} 
          onClick={(e) => { 
            e.preventDefault(); 
            if (page !== 1) onPageChange(1);
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
              if (page !== i) onPageChange(i);
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
              if (page !== totalPages) onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }, [page, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  onPageChange(page - 1);
                }
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {paginationItems}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) {
                  onPageChange(page + 1);
                }
              }}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
