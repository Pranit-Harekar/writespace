
import React from 'react';

export const FeaturedArticlesCarouselSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border rounded-lg overflow-hidden animate-pulse">
          <div className="bg-muted h-48"></div>
          <div className="p-4">
            <div className="bg-muted/30 h-5 w-16 mb-4 rounded"></div>
            <div className="bg-muted/30 h-6 mb-2 rounded w-3/4"></div>
            <div className="bg-muted/30 h-4 rounded w-full mb-4"></div>
            <div className="flex items-center gap-3">
              <div className="bg-muted/30 h-8 w-8 rounded-full"></div>
              <div>
                <div className="bg-muted/30 h-4 mb-1 rounded w-24"></div>
                <div className="bg-muted/30 h-3 rounded w-36"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
