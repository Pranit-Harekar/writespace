
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { FeaturedArticle } from './FeaturedArticle';
import { FeaturedArticlesCarouselSkeleton } from './FeaturedArticlesCarouselSkeleton';
import { FeaturedArticlesEmptyState } from './FeaturedArticlesEmptyState';
import { ArticleProps } from './ArticleCard';
import { fetchArticles } from '@/services/articlesService';

interface FeaturedArticlesCarouselProps {
  limit?: number;
}

export const FeaturedArticlesCarousel: React.FC<FeaturedArticlesCarouselProps> = ({
  limit = 5,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [current, setCurrent] = useState(0);

  const [featuredArticles, setFeaturedArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load featured articles when component comes into view
  useEffect(() => {
    console.log('FeaturedArticlesCarousel - inView:', inView);
    if (inView) {
      const loadArticles = async () => {
        console.log('FeaturedArticlesCarousel - Loading articles...');
        try {
          // Start loading state
          setIsLoading(true);
          
          // Fetch articles data
          const { articles } = await fetchArticles({
            limit,
            filterByCategory: '',
            filterByAuthor: '',
            searchQuery: '',
            page: 1,
          });
          
          console.log('FeaturedArticlesCarousel - Articles loaded:', articles);
          
          // Make sure to set loading to false before handling the response
          setIsLoading(false);
          
          if (articles && articles.length > 0) {
            setFeaturedArticles(articles);
            setError(null);
          } else {
            console.log('No featured articles found');
            setFeaturedArticles([]);
          }
        } catch (err) {
          console.error('Error loading featured articles:', err);
          setError(err as Error);
          setIsLoading(false);
        }
      };

      loadArticles();
    }
  }, [inView, limit]);

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

  console.log('FeaturedArticlesCarousel - Rendering with state:', { 
    isLoading, 
    error, 
    articlesCount: featuredArticles.length 
  });

  // Handle loading state
  if (isLoading) {
    console.log('FeaturedArticlesCarousel - Showing loading skeleton');
    return <FeaturedArticlesCarouselSkeleton />;
  }

  // Handle error state
  if (error) {
    console.log('FeaturedArticlesCarousel - Showing error state');
    return <FeaturedArticlesEmptyState error={error} />;
  }

  // Handle empty state
  if (!featuredArticles || featuredArticles.length === 0) {
    console.log('FeaturedArticlesCarousel - Showing empty state');
    return <FeaturedArticlesEmptyState />;
  }

  // Render the carousel with articles
  console.log('FeaturedArticlesCarousel - Showing carousel with articles');
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
              <FeaturedArticle {...article} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
