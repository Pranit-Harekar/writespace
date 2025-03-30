
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
      <Carousel className="w-full" setApi={setCarouselApi}>
        <CarouselContent>
          {articles.map(article => (
            <CarouselItem key={article.id} className="min-h-[300px]">
              <FeaturedArticle {...article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <CarouselPrevious className="relative -left-0 ml-4 pointer-events-auto" />
          <CarouselNext className="relative -right-0 mr-4 pointer-events-auto" />
        </div>
      </Carousel>
    </div>
  );
};
