import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { FollowButton } from '@/components/FollowButton';

type ProfileData = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
};

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { user, profile: currentUserProfile } = useAuth();
  const navigate = useNavigate();

  // Fetch follower and following counts
  const fetchFollowCounts = async (userId: string) => {
    try {
      // Get follower count
      const { data: followers, error: followerError } = await supabase.rpc('get_follower_count', {
        user_id: userId,
      });

      if (followerError) throw followerError;
      setFollowerCount(followers || 0);

      // Get following count
      const { data: following, error: followingError } = await supabase.rpc('get_following_count', {
        user_id: userId,
      });

      if (followingError) throw followingError;
      setFollowingCount(following || 0);
    } catch (err) {
      console.error('Error fetching follow counts:', err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from('profiles').select('*');

        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (UUID_REGEX.test(username)) {
          query = query.eq('id', username);
        } else {
          query = query.eq('username', username);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          setError('Could not find this user profile');
          return;
        }

        if (!data) {
          setError('Profile not found');
          return;
        }

        // If the profile belongs to the current user, redirect to the profile page
        if (user && user.id === data.id) {
          navigate('/profile', { replace: true });
          return;
        }

        setProfile(data as ProfileData);

        // Fetch follower and following counts
        await fetchFollowCounts(data.id);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, user, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleFollowChange = () => {
    if (profile) {
      fetchFollowCounts(profile.id);
    }
  };

  // If we're redirecting to the user's own profile page, show a loading state
  if (user && profile && user.id === profile.id) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <ProfileSkeleton />
          ) : error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : profile ? (
            <div>
              <h1 className="text-3xl font-bold mb-8">User Profile</h1>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
                    <AvatarFallback>
                      {profile.full_name
                        ? getInitials(profile.full_name)
                        : getInitials(profile.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      {profile.full_name || profile.username}
                    </CardTitle>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span>{followingCount} following</span>
                      </div>
                    </div>
                  </div>
                  <FollowButton profileId={profile.id} onFollowChange={handleFollowChange} />
                </CardHeader>
                <CardContent className="pt-4">
                  {profile.bio && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-1">About</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  )}

                  {profile.website && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-1">Website</h3>
                      <a
                        href={
                          profile.website.startsWith('http')
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Profile not found</AlertDescription>
            </Alert>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

const ProfileSkeleton = () => (
  <div>
    <Skeleton className="h-10 w-40 mb-8" />
    <div className="flex flex-row items-center gap-4 mb-6">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export default PublicProfile;
