import React, { useState, useEffect } from 'react';
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
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  articleId, 
  initialLikesCount = 0,
  className = ""
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkIfLiked();
      getLikesCount();
    } else {
      setIsLoading(false);
    }
  }, [user, articleId]);

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

  const getLikesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      if (error) throw error;
      
      setLikesCount(count || 0);
    } catch (error) {
      console.error('Error getting likes count:', error);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff4d94', '#ff99c8', '#ff66b3'],
      angle: 90,
      startVelocity: 30,
      gravity: 0.8,
      shapes: ['circle', 'square'],
      ticks: 300
    });
  };

  const toggleLike = async () => {
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
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Add like
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: user.id,
          });

        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
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

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={isLoading}
      className={`gap-1 ${className}`}
      aria-label={isLiked ? "Unlike article" : "Like article"}
    >
      <Heart 
        className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
      />
      <span>{likesCount}</span>
    </Button>
  );
};
