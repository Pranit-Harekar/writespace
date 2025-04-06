import React from 'react';

interface ArticlesEmptyStateProps {
  filterByCategory?: string;
}

export const ArticlesEmptyState: React.FC<ArticlesEmptyStateProps> = ({ filterByCategory }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-2">No articles found</h2>
      <p className="text-muted-foreground">
        {filterByCategory
          ? 'Try changing your filters or check back later.'
          : 'Check back later for new content.'}
      </p>
    </div>
  );
};
