import React from 'react';

interface ArticlesListSkeletonProps {
  count?: number;
}

export const ArticlesListSkeleton: React.FC<ArticlesListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="border rounded-lg p-4 h-64 animate-pulse">
            <div className="bg-muted h-1/3 mb-4 rounded"></div>
            <div className="bg-muted h-4 mb-2 rounded w-3/4"></div>
            <div className="bg-muted h-4 mb-4 rounded w-1/2"></div>
            <div className="bg-muted h-20 rounded"></div>
          </div>
        ))}
    </div>
  );
};
