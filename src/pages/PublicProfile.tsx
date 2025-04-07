import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Users, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { FollowButton } from '@/components/FollowButton';
import { Separator } from '@/components/ui/separator';
import { ArticlesList } from '@/components/ArticlesList';
import { ViewMode } from '@/components/ViewSwitcher';

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
  const [articlesViewMode, setArticlesViewMode] = useState<ViewMode>('grid');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchFollowCounts = async (userId: string) => {
    try {
      const { data: followers, error: followerError } = await supabase.rpc('get_follower_count', {
        user_id: userId,
      });

      if (followerError) throw followerError;
      setFollowerCount(followers || 0);

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

        if (user && user.id === data.id) {
          navigate('/profile', { replace: true });
          return;
        }

        setProfile(data as ProfileData);

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

  if (user && profile && user.id === profile.id) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {isLoading ? (
          <ProfileSkeleton />
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : profile ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-background shadow-md">
                <AvatarImage
                  src={profile.avatar_url || ''}
                  alt={profile.full_name || profile.username}
                />
                <AvatarFallback className="text-2xl md:text-4xl">
                  {profile.full_name
                    ? getInitials(profile.full_name)
                    : getInitials(profile.username)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile.full_name || profile.username}
                    </h1>
                    <p className="text-muted-foreground text-lg">@{profile.username}</p>
                  </div>
                  <FollowButton profileId={profile.id} onFollowChange={handleFollowChange} />
                </div>

                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-medium">{followerCount}</span>{' '}
                      <span className="text-muted-foreground">
                        {followerCount === 1 ? 'follower' : 'followers'}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">{followingCount}</span>{' '}
                    <span className="text-muted-foreground">following</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {profile.bio && (
              <div>
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {profile.website && (
              <div>
                <h2 className="text-lg font-medium mb-2">Website</h2>
                <a
                  href={
                    profile.website.startsWith('http')
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1.5"
                >
                  <LinkIcon className="h-4 w-4" />
                  {profile.website}
                </a>
              </div>
            )}

            <div className="mt-10">
              {profile && (
                <ArticlesList
                  sectionTitle="Recent Articles"
                  limit={6}
                  filterByAuthor={profile.id}
                  showViewSwitcher={true}
                  defaultView={articlesViewMode}
                />
              )}
            </div>
          </div>
        ) : (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Profile not found</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-8 max-w-4xl mx-auto">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
      <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
      <div className="flex-1 space-y-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
    <Skeleton className="h-px w-full" />
    <div>
      <Skeleton className="h-6 w-20 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div>
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  </div>
);

export default PublicProfile;
