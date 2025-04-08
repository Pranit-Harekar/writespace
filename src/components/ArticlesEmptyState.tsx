
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterOptions } from '@/services/myArticlesService';

interface ArticlesEmptyStateProps {
  hasFilters: boolean;
  isCreatingDraft: boolean;
  onClearFilters: () => void;
  onCreateDraft: () => void;
}

export const ArticlesEmptyState: React.FC<ArticlesEmptyStateProps> = ({
  hasFilters,
  isCreatingDraft,
  onClearFilters,
  onCreateDraft,
}) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-2">
        {hasFilters 
          ? "No articles match your filters" 
          : "You haven't created any articles yet"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {hasFilters 
          ? "Try adjusting your filters to see more results"
          : "Start writing and sharing your knowledge with the community"}
      </p>
      {hasFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button onClick={onCreateDraft} disabled={isCreatingDraft}>
          {isCreatingDraft ? 'Creating Draft...' : 'Create Your First Article'}
        </Button>
      )}
    </div>
  );
};
