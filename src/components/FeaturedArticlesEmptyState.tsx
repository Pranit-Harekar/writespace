import React from 'react';

export const FeaturedArticlesEmptyState: React.FC = () => {
  return (
    <div className="border rounded-lg p-6 text-center mb-8">
      <p className="text-muted-foreground">No featured articles found</p>
    </div>
  );
};
