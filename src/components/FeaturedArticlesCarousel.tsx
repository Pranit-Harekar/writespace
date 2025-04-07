
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import FeaturedArticle from './FeaturedArticle';
import FeaturedArticlesCarouselSkeleton from './FeaturedArticlesCarouselSkeleton';
import FeaturedArticlesEmptyState from './FeaturedArticlesEmptyState';
import { ArticleProps } from './ArticleCard';
import { useFeaturedArticles } from '@/services/featuredArticlesService';

interface FeaturedArticlesCarouselProps {
  limit?: number;
}

export const FeaturedArticlesCarousel: React.FC<FeaturedArticlesCarouselProps> = ({
  limit = 5,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [current, setCurrent] = useState(0);
  
  const { data: featuredArticles, isLoading, error } = useFeaturedArticles(limit, inView);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handlePrev = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  if (error) {
    return <FeaturedArticlesEmptyState error={error} />;
  }

  if (isLoading) {
    return <FeaturedArticlesCarouselSkeleton />;
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return <FeaturedArticlesEmptyState />;
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      
      <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
        <CarouselContent>
          {featuredArticles.map((article: ArticleProps) => (
            <CarouselItem key={article.id} className="pt-1 md:basis-1/2 lg:basis-1/3">
              <FeaturedArticle article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
