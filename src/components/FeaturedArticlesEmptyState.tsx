
import React from 'react';

interface FeaturedArticlesEmptyStateProps {
  error?: Error | null;
}

export const FeaturedArticlesEmptyState: React.FC<FeaturedArticlesEmptyStateProps> = ({ error }) => {
  return (
    <div className="border rounded-lg p-6 text-center mb-8">
      {error ? (
        <p className="text-muted-foreground">Error loading featured articles: {error.message}</p>
      ) : (
        <p className="text-muted-foreground">No featured articles found</p>
      )}
    </div>
  );
};
