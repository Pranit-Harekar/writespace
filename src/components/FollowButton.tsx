
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
        // Unfollow logic
        const { error } = await supabase
          .from('user_followers')
          .delete()
          .match({ follower_id: user.id, following_id: profileId });

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user",
        });
      } else {
        // Follow logic
        const { error } = await supabase
          .from('user_followers')
          .insert({ follower_id: user.id, following_id: profileId });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Followed",
          description: "You are now following this user",
        });
      }
      
      if (onFollowChange) {
        onFollowChange(isFollowing);
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
