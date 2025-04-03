
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleProps } from '@/components/ArticleCard';
import { extractExcerpt } from '@/lib/textUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export const FeaturedArticlesCarousel = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [animationRef] = useAutoAnimate();

  // Fetch featured articles
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        // Get articles with highest combined likes and comments count (top 5)
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            subtitle,
            content,
            category,
            category_id,
            categories:category_id(id, name),
            read_time,
            featured_image,
            published_at,
            author_id
          `)
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(15); // Fetch more than needed to ensure we have enough after filtering

        if (articlesError) throw articlesError;

        // If no articles found, return early
        if (!articlesData || articlesData.length === 0) {
          setArticles([]);
          setIsLoading(false);
          return;
        }

        // Extract author_ids to fetch profiles
        const authorIds = [...new Set(articlesData.map((article) => article.author_id))];

        // Fetch author profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', authorIds);

        if (profilesError) throw profilesError;

        // Get likes and comments counts for each article
        const articleIds = articlesData.map(article => article.id);
        
        // Count likes for each article
        const likesCountMap = new Map();
        for (const articleId of articleIds) {
          const { count, error } = await supabase
            .from('article_likes')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId);
            
          if (error) throw error;
          likesCountMap.set(articleId, count || 0);
        }
        
        // Count comments for each article
        const commentsCountMap = new Map();
        for (const articleId of articleIds) {
          const { count, error } = await supabase
            .from('article_comments')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId);
            
          if (error) throw error;
          commentsCountMap.set(articleId, count || 0);
        }

        // Create a lookup map for profiles
        const profileMap = new Map();
        profilesData?.forEach((profile) => {
          profileMap.set(profile.id, profile);
        });

        // Transform data to match ArticleProps and add engagement score
        const articlesWithMetrics = articlesData.map((item) => {
          const profile = profileMap.get(item.author_id) || {
            id: item.author_id,
            username: 'Anonymous',
            full_name: null,
            avatar_url: null,
          };

          // Get category name from the categories relation or fall back to the category field
          const categoryName = item.categories ? item.categories.name : item.category;

          // Use explicit subtitle or generate from content
          const excerptText = item.subtitle?.trim() 
            ? item.subtitle 
            : extractExcerpt(item.content);

          // Get engagement metrics
          const likesCount = likesCountMap.get(item.id) || 0;
          const commentsCount = commentsCountMap.get(item.id) || 0;
          
          // Calculate an engagement score (likes + comments)
          const engagementScore = likesCount + commentsCount;

          return {
            id: item.id,
            title: item.title,
            excerpt: excerptText,
            author: {
              id: profile.id,
              name: profile.full_name || profile.username || 'Anonymous',
              profileImage: profile.avatar_url || undefined,
            },
            publishedAt: item.published_at || '',
            category: categoryName || 'Uncategorized',
            readTime: item.read_time || 5,
            featuredImage: item.featured_image || undefined,
            likesCount,
            commentsCount,
            engagementScore, // Add engagement score
          };
        });

        // Sort by engagement score and take top 5
        const topArticles = articlesWithMetrics
          .sort((a, b) => b.engagementScore - a.engagementScore)
          .slice(0, 5);

        setArticles(topArticles);
      } catch (error: unknown) {
        console.error('Error fetching featured articles:', error);
        toast({
          title: 'Error',
          description: error['message'] || 'Failed to load featured articles',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, [toast]);

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

    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
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

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden h-[350px] mb-8 animate-pulse">
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
  }

  if (articles.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center mb-8">
        <p className="text-muted-foreground">No featured articles found</p>
      </div>
    );
  }

  const handleDotClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  return (
    <div className="mb-8" ref={animationRef}>
      <Carousel className="w-full relative" setApi={setCarouselApi} ref={carouselRef}>
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id} className="min-h-[350px]">
              <FeaturedArticle {...article} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              index === activeIndex ? "bg-primary" : "bg-muted"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
