
import React from 'react';

interface ArticlesEmptyStateProps {
  filterByCategory?: string;
}

export const ArticlesEmptyState: React.FC<ArticlesEmptyStateProps> = ({ filterByCategory }) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-medium mb-2">No articles found</h2>
      <p className="text-muted-foreground">
        {filterByCategory ? `No articles found in category "${filterByCategory}".` : 'Try changing your filters or check back later.'}
      </p>
    </div>
  );
};
