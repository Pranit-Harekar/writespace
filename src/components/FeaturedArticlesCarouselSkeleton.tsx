
import React from 'react';

export const FeaturedArticlesCarouselSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg overflow-hidden h-[300px] mb-8 relative animate-pulse">
      <div className="absolute inset-0 bg-muted"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-between">
        <div>
          <div className="bg-muted/30 h-5 mb-4 rounded w-1/4"></div>
          <div className="bg-muted/30 h-8 mb-2 rounded w-3/4"></div>
          <div className="bg-muted/30 h-4 rounded w-2/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted/30 h-10 w-10 rounded-full"></div>
            <div>
              <div className="bg-muted/30 h-4 mb-1 rounded w-24"></div>
              <div className="bg-muted/30 h-3 rounded w-36"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
