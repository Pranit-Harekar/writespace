import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface LikeButtonProps {
  articleId: string;
  initialLikesCount?: number;
  className?: string;
  onLikeUpdate?: (newCount: number) => void;
  readOnly?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  initialLikesCount = 0,
  className = '',
  onLikeUpdate,
  readOnly = false,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Initialize with the initialLikesCount
    setLikesCount(initialLikesCount);

    // Only check like status if user is logged in and we haven't fetched yet
    if (user && !dataFetchedRef.current && !readOnly) {
      dataFetchedRef.current = true;
      checkIfLiked();
    } else if (!user || readOnly) {
      setIsLoading(false);
    }
  }, [user, articleId, initialLikesCount, readOnly]);

  const checkIfLiked = async () => {
    try {
      const { data, error } = await supabase
        .from('article_likes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'],
      angle: 90,
      startVelocity: 30,
      gravity: 0.8,
      shapes: ['circle', 'square'],
      ticks: 300,
    });
  };

  const toggleLike = async () => {
    if (readOnly) return;

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to like articles',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        const newCount = Math.max(0, likesCount - 1);
        setLikesCount(newCount);
        if (onLikeUpdate) {
          onLikeUpdate(newCount);
        }
      } else {
        // Add like
        const { error } = await supabase.from('article_likes').insert({
          article_id: articleId,
          user_id: user.id,
        });

        if (error) throw error;

        setIsLiked(true);
        const newCount = likesCount + 1;
        setLikesCount(newCount);
        if (onLikeUpdate) {
          onLikeUpdate(newCount);
        }

        // Trigger confetti effect when liking
        triggerConfetti();
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For read-only mode, use a different rendering that looks like a normal element
  if (readOnly) {
    return (
      <div className={`flex items-center gap-1 text-muted-foreground ${className}`}>
        <Heart className="h-4 w-4" />
        <span>{likesCount}</span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={isLoading || !user}
      className={`gap-1 ${!user ? 'cursor-default' : ''} ${className}`}
      aria-label={isLiked ? 'Unlike article' : 'Like article'}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      <span>{likesCount}</span>
    </Button>
  );
};
