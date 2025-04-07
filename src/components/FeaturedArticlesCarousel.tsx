
import React, { useState, useEffect, useRef } from 'react';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleProps } from '@/components/ArticleCard';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useFeaturedArticlesService } from '@/services/featuredArticlesService';
import { FeaturedArticlesCarouselSkeleton } from '@/components/FeaturedArticlesCarouselSkeleton';
import { FeaturedArticlesEmptyState } from '@/components/FeaturedArticlesEmptyState';

export const FeaturedArticlesCarousel = () => {
  const { fetchFeaturedArticles } = useFeaturedArticlesService();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const dataFetchedRef = useRef(false);
  const [animationRef] = useAutoAnimate();

  // Fetch featured articles only once
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const loadArticles = async () => {
      const data = await fetchFeaturedArticles();
      setArticles(data);
      setIsLoading(false);
    };

    loadArticles();
  }, [fetchFeaturedArticles]);

  if (isLoading) {
    return <FeaturedArticlesCarouselSkeleton />;
  }

  if (articles.length === 0) {
    return <FeaturedArticlesEmptyState />;
  }

  return (
    <div className="mb-8 relative" ref={animationRef}>
      <Carousel 
        className="w-full" 
        setApi={setCarouselApi}
        opts={{
          align: 'start',
          loop: true,
          // Disable autoplay
          autoplay: false
        }}
      >
        <CarouselContent className="-ml-4">
          {articles.map(article => (
            <CarouselItem key={article.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="h-full">
                <FeaturedArticle {...article} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <CarouselPrevious className="relative -left-0 md:left-0 ml-2 pointer-events-auto" />
          <CarouselNext className="relative -right-0 md:right-0 mr-2 pointer-events-auto" />
        </div>
      </Carousel>
    </div>
  );
};
