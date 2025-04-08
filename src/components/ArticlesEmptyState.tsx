
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ArticlesEmptyStateProps {
  hasFilters?: boolean;
  isCreatingDraft?: boolean;
  onClearFilters?: () => void;
  onCreateDraft?: () => void;
  filterByCategory?: string; // Add this prop to fix the error
}

export const ArticlesEmptyState: React.FC<ArticlesEmptyStateProps> = ({
  hasFilters = false,
  isCreatingDraft = false,
  onClearFilters,
  onCreateDraft,
  filterByCategory,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-primary/5 rounded-full p-6 mb-4">
        <FileQuestion className="h-12 w-12 text-primary/60" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No articles found</h3>
      
      {filterByCategory ? (
        <p className="text-muted-foreground mb-6">
          No articles found in the "{filterByCategory}" category.
        </p>
      ) : hasFilters ? (
        <p className="text-muted-foreground mb-6">
          No articles match your current filters.
        </p>
      ) : (
        <p className="text-muted-foreground mb-6">
          You haven't created any articles yet.
        </p>
      )}

      {hasFilters && onClearFilters && (
        <Button onClick={onClearFilters} variant="outline" className="mb-2">
          Clear filters
        </Button>
      )}
      
      {onCreateDraft && (
        <Button onClick={onCreateDraft} disabled={isCreatingDraft}>
          {isCreatingDraft ? 'Creating...' : 'Create your first article'}
        </Button>
      )}
    </div>
  );
};
