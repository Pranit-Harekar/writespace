import React, { useState, useEffect, useRef } from 'react';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleProps } from '@/components/ArticleCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useFeaturedArticlesService } from '@/services/featuredArticlesService';
import { FeaturedArticlesCarouselSkeleton } from '@/components/FeaturedArticlesCarouselSkeleton';
import { FeaturedArticlesEmptyState } from '@/components/FeaturedArticlesEmptyState';
import { CarouselDots } from '@/components/CarouselDots';

export const FeaturedArticlesCarousel = () => {
  const { fetchFeaturedArticles } = useFeaturedArticlesService();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [animationRef] = useAutoAnimate();
  const dataFetchedRef = useRef(false);

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

  // Set up auto-rotation for carousel with loop
  useEffect(() => {
    if (!carouselApi || articles.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        if (activeIndex >= articles.length - 1) {
          // If at the last slide, go back to the first slide
          carouselApi.scrollTo(0);
        } else {
          carouselApi.scrollNext();
        }
      }
    }, 5000); // Auto rotate every 5 seconds

    return () => clearInterval(interval);
  }, [carouselApi, articles.length, activeIndex, isPaused]);

  // Update active index when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Set up event listeners for pausing on hover
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.carousel-pause-trigger')) {
        setIsPaused(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.carousel-pause-trigger')) {
        setIsPaused(false);
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', handleMouseEnter, true);
      carouselElement.addEventListener('mouseleave', handleMouseLeave, true);
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', handleMouseEnter, true);
        carouselElement.removeEventListener('mouseleave', handleMouseLeave, true);
      }
    };
  }, []);

  const handleDotClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  if (isLoading) {
    return <FeaturedArticlesCarouselSkeleton />;
  }

  if (articles.length === 0) {
    return <FeaturedArticlesEmptyState />;
  }

  return (
    <div className="mb-8" ref={animationRef}>
      <Carousel className="w-full relative" setApi={setCarouselApi} ref={carouselRef}>
        <CarouselContent>
          {articles.map(article => (
            <CarouselItem key={article.id} className="min-h-[240px]">
              <FeaturedArticle {...article} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselDots total={articles.length} activeIndex={activeIndex} onDotClick={handleDotClick} />
    </div>
  );
};
