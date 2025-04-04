
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface FollowButtonProps {
  profileId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  profileId, 
  className = "", 
  size = "default",
  onFollowChange 
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || user.id === profileId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('is_following', {
            follower: user.id,
            following: profileId
          });

        if (error) throw error;
        setIsFollowing(!!data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfFollowing();
  }, [user, profileId]);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow logic - use custom RPC call or direct SQL
        const { error } = await supabase.rpc('unfollow_user', {
          follower: user.id,
          following: profileId
        });

        if (error) {
          // Fallback to raw SQL if the RPC doesn't exist
          const { error: deleteError } = await supabase.auth.refreshSession();
          if (deleteError) throw deleteError;

          // After refreshing session, try direct delete
          const { error: directError } = await supabase
            .from('user_followers')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', profileId);
          
          if (directError) throw directError;
        }

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user",
        });
      } else {
        // Follow logic - use custom RPC call or direct SQL
        const { error } = await supabase.rpc('follow_user', {
          follower: user.id,
          following: profileId
        });

        if (error) {
          // Fallback to raw SQL if the RPC doesn't exist
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) throw refreshError;

          // After refreshing session, try direct insert
          const { error: directError } = await supabase
            .from('user_followers')
            .insert({ 
              follower_id: user.id, 
              following_id: profileId 
            })
            .single();
          
          if (directError) throw directError;
        }

        setIsFollowing(true);
        toast({
          title: "Followed",
          description: "You are now following this user",
        });
      }
      
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.id === profileId) {
    return null; // Don't show follow button for own profile or when not logged in
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className={className}
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" /> Follow
        </>
      )}
    </Button>
  );
};
