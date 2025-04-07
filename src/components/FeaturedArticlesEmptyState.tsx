
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturedArticlesEmptyStateProps {
  error?: Error | null;
}

export const FeaturedArticlesEmptyState: React.FC<FeaturedArticlesEmptyStateProps> = ({ error }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6 text-center">
        {error ? (
          <p className="text-muted-foreground">Error loading featured articles: {error.message}</p>
        ) : (
          <p className="text-muted-foreground">No featured articles found</p>
        )}
      </CardContent>
    </Card>
  );
};
