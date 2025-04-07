
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/contexts/LanguageContext';
import { AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileLink } from '@/components/ProfileLink';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileAvatarUpload } from '@/components/ProfileAvatarUpload';
import { toast } from '@/components/ui/use-toast';

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  bio: z.string().optional(),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  preferred_language: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type UserData = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

const Profile = () => {
  const { user, profile, updateProfile, signOut, checkUsernameAvailability, canChangeUsername } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const [followersData, setFollowersData] = useState<UserData[]>([]);
  const [followingData, setFollowingData] = useState<UserData[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [canChangeUsernameNow, setCanChangeUsernameNow] = useState(true);
  const [usernameDebounceTimeout, setUsernameDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      website: profile?.website || '',
      preferred_language: profile?.preferred_language || 'en',
    },
  });

  // Watch username value to check availability with debounce
  const watchUsername = watch('username');
  
  useEffect(() => {
    if (profile && watchUsername && watchUsername !== profile.username) {
      setUsernameChanged(true);
      
      // Clear any existing timeout
      if (usernameDebounceTimeout) {
        clearTimeout(usernameDebounceTimeout);
      }
      
      // Set a new timeout to check username availability
      const timeout = setTimeout(async () => {
        const { available } = await checkUsernameAvailability(watchUsername);
        setUsernameAvailable(available);
      }, 500); // 500ms debounce
      
      setUsernameDebounceTimeout(timeout);
    } else {
      setUsernameChanged(false);
      setUsernameAvailable(true);
    }
    
    return () => {
      if (usernameDebounceTimeout) {
        clearTimeout(usernameDebounceTimeout);
      }
    };
  }, [watchUsername, profile]);
  
  // Check if user can change username
  useEffect(() => {
    if (user && profile) {
      const checkUsernameChangeAbility = async () => {
        const { canChange } = await canChangeUsername();
        setCanChangeUsernameNow(canChange);
      };
      
      checkUsernameChangeAbility();
    }
  }, [user, profile]);

  React.useEffect(() => {
    if (profile) {
      setValue('username', profile.username || '');
      setValue('full_name', profile.full_name || '');
      setValue('bio', profile.bio || '');
      setValue('website', profile.website || '');
      setValue('preferred_language', profile.preferred_language || 'en');
    }
  }, [profile, setValue]);

  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (!user) return;

      try {
        // Get follower count
        const { data: followers, error: followerError } = await supabase.rpc('get_follower_count', {
          user_id: user.id,
        });

        if (followerError) throw followerError;
        setFollowerCount(followers || 0);

        // Get following count
        const { data: following, error: followingError } = await supabase.rpc(
          'get_following_count',
          { user_id: user.id }
        );

        if (followingError) throw followingError;
        setFollowingCount(following || 0);
      } catch (err) {
        console.error('Error fetching follow counts:', err);
      }
    };

    fetchFollowCounts();
  }, [user]);

  const fetchFollowers = async () => {
    if (!user) return;

    setIsLoadingFollowers(true);
    try {
      // Get followers
      const { data: userFollowers, error: followerError } = await supabase
        .from('user_followers')
        .select('follower_id')
        .eq('following_id', user.id);

      if (followerError) throw followerError;

      if (userFollowers && userFollowers.length > 0) {
        const followerIds = userFollowers.map(f => f.follower_id);

        // Get follower profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', followerIds);

        if (profilesError) throw profilesError;
        setFollowersData(profiles || []);
      } else {
        setFollowersData([]);
      }
    } catch (err) {
      console.error('Error fetching followers:', err);
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;

    setIsLoadingFollowing(true);
    try {
      // Get following users
      const { data: userFollowing, error: followingError } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followingError) throw followingError;

      if (userFollowing && userFollowing.length > 0) {
        const followingIds = userFollowing.map(f => f.following_id);

        // Get following profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', followingIds);

        if (profilesError) throw profilesError;
        setFollowingData(profiles || []);
      } else {
        setFollowingData([]);
      }
    } catch (err) {
      console.error('Error fetching following users:', err);
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const openFollowersDialog = () => {
    setShowFollowersDialog(true);
    fetchFollowers();
  };

  const openFollowingDialog = () => {
    setShowFollowingDialog(true);
    fetchFollowing();
  };

  if (!user || !profile) {
    navigate('/login');
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    // Check username availability if it was changed
    if (data.username !== profile.username) {
      const { available } = await checkUsernameAvailability(data.username);
      
      if (!available) {
        setError('Username is already taken');
        setIsLoading(false);
        return;
      }
      
      // Check if user can change username now
      const { canChange } = await canChangeUsername();
      
      if (!canChange) {
        setError('Username can only be changed once every 30 days');
        setIsLoading(false);
        return;
      }
    }

    const { error } = await updateProfile(data);

    if (error) {
      setError(error.message);
    } else {
      // Update the language in the app if the user changed it
      if (data.preferred_language !== profile?.preferred_language) {
        setLanguage(data.preferred_language as any);
      }
    }

    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <ProfileAvatarUpload 
                currentAvatarUrl={profile.avatar_url} 
                fullName={profile.full_name} 
              />
              
              <p className="text-sm text-muted-foreground mb-2 mt-2">{user.email}</p>

              {/* Follow stats */}
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={openFollowersDialog}
                  className="flex flex-col items-center hover:text-primary transition-colors"
                >
                  <span className="text-lg font-medium">{followerCount}</span>
                  <span className="text-sm text-muted-foreground">Followers</span>
                </button>
                <button
                  onClick={openFollowingDialog}
                  className="flex flex-col items-center hover:text-primary transition-colors"
                >
                  <span className="text-lg font-medium">{followingCount}</span>
                  <span className="text-sm text-muted-foreground">Following</span>
                </button>
              </div>

              <Button variant="outline" className="w-full" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>

            <div className="flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    {...register('username')} 
                    className={!usernameAvailable ? 'border-destructive' : ''}
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm">{errors.username.message}</p>
                  )}
                  {usernameChanged && !usernameAvailable && (
                    <p className="text-destructive text-sm">This username is already taken</p>
                  )}
                  {usernameChanged && !canChangeUsernameNow && (
                    <p className="text-amber-500 text-sm">You can only change your username once every 30 days</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-destructive text-sm">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_language">Preferred Language</Label>
                  <Select
                    defaultValue={profile.preferred_language}
                    onValueChange={value => setValue('preferred_language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGES).map(([code, lang]) => (
                        <SelectItem key={code} value={code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferred_language && (
                    <p className="text-destructive text-sm">{errors.preferred_language.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register('bio')} className="h-24" />
                  {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register('website')} placeholder="https://" />
                  {errors.website && (
                    <p className="text-destructive text-sm">{errors.website.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || (usernameChanged && !usernameAvailable) || (usernameChanged && !canChangeUsernameNow)}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          </div>

          {/* Followers Dialog */}
          <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Followers</DialogTitle>
              </DialogHeader>
              {isLoadingFollowers ? (
                <div className="py-6 text-center">Loading...</div>
              ) : followersData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {followersData.map(follower => (
                      <TableRow key={follower.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={follower.avatar_url || ''}
                                alt={follower.full_name || follower.username}
                              />
                              <AvatarFallback>
                                {follower.full_name
                                  ? getInitials(follower.full_name)
                                  : getInitials(follower.username)}
                              </AvatarFallback>
                            </Avatar>
                            <ProfileLink
                              userId={follower.id}
                              username={follower.username}
                              displayName={follower.full_name || follower.username}
                              onClick={() => setShowFollowersDialog(false)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-6 text-center text-muted-foreground">No followers yet</div>
              )}
            </DialogContent>
          </Dialog>

          {/* Following Dialog */}
          <Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Following</DialogTitle>
              </DialogHeader>
              {isLoadingFollowing ? (
                <div className="py-6 text-center">Loading...</div>
              ) : followingData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {followingData.map(following => (
                      <TableRow key={following.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={following.avatar_url || ''}
                                alt={following.full_name || following.username}
                              />
                              <AvatarFallback>
                                {following.full_name
                                  ? getInitials(following.full_name)
                                  : getInitials(following.username)}
                              </AvatarFallback>
                            </Avatar>
                            <ProfileLink
                              userId={following.id}
                              username={following.username}
                              displayName={following.full_name || following.username}
                              onClick={() => setShowFollowingDialog(false)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  Not following anyone yet
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
