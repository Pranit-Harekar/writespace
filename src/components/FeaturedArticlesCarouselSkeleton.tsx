
import React from 'react';

export const FeaturedArticlesCarouselSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg overflow-hidden h-[320px] mb-8 animate-pulse">
      <div className="grid md:grid-cols-5 h-full">
        <div className="md:col-span-3 p-6">
          <div className="bg-muted h-4 mb-2 rounded w-1/4"></div>
          <div className="bg-muted h-8 mb-4 rounded w-3/4"></div>
          <div className="bg-muted h-20 rounded"></div>
        </div>
        <div className="md:col-span-2 bg-muted"></div>
      </div>
    </div>
  );
};
