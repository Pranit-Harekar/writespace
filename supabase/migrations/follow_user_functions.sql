
-- Create function to follow a user
CREATE OR REPLACE FUNCTION public.follow_user(follower UUID, following UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_followers (follower_id, following_id)
  VALUES (follower, following)
  ON CONFLICT (follower_id, following_id) DO NOTHING;
END;
$$;

-- Create function to unfollow a user
CREATE OR REPLACE FUNCTION public.unfollow_user(follower UUID, following UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_followers
  WHERE follower_id = follower AND following_id = following;
END;
$$;
