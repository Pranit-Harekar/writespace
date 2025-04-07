
import React from 'react';
import { ViewMode } from '@/components/ViewSwitcher';

interface ArticlesListSkeletonProps {
  count?: number;
  viewMode?: ViewMode;
}

export const ArticlesListSkeleton: React.FC<ArticlesListSkeletonProps> = ({ 
  count = 6,
  viewMode = 'grid'
}) => {
  if (viewMode === 'grid') {
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
  }

  return (
    <div className="space-y-6">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 border-b pb-6 animate-pulse">
            <div className="md:w-1/4 lg:w-1/3">
              <div className="bg-muted h-48 md:h-28 rounded-md w-full"></div>
            </div>
            <div className="md:w-3/4 lg:w-2/3 flex flex-col">
              <div className="bg-muted h-4 mb-2 rounded w-24"></div>
              <div className="bg-muted h-6 mb-2 rounded w-3/4"></div>
              <div className="bg-muted h-4 mb-4 rounded w-full"></div>
              <div className="flex justify-between mt-auto">
                <div className="bg-muted h-4 rounded w-32"></div>
                <div className="bg-muted h-4 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
