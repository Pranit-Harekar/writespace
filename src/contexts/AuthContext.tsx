
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  bio: string | null;
  website: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: any | null }>;
  checkUsernameAvailability: (username: string) => Promise<{ available: boolean; error: any | null }>;
  canChangeUsername: () => Promise<{ canChange: boolean; error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch profile data of the logged in user
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Upload avatar image
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { url: null, error: 'No user logged in' };
    }

    try {
      // Create a unique file name using the user's ID
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to the profile-images bucket
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError };
      }

      // Get the public URL for the uploaded file
      const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        return { url: null, error: updateError };
      }

      // Refetch the profile to update state
      await fetchProfile(user.id);

      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      return { url: null, error };
    }
  };

  // Check if a username is available
  const checkUsernameAvailability = async (username: string) => {
    try {
      // Skip check if the username is the same as the current user's username
      if (profile && profile.username === username) {
        return { available: true, error: null };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') { // No rows returned means username is available
        return { available: true, error: null };
      } else if (error) {
        return { available: false, error };
      }

      return { available: false, error: null }; // Username exists
    } catch (error: any) {
      return { available: false, error };
    }
  };

  // Check if a user can change their username (based on cooldown period)
  const canChangeUsername = async () => {
    if (!user) {
      return { canChange: false, error: 'No user logged in' };
    }

    try {
      // Use raw SQL query instead of RPC call since types are not updated yet
      const { data, error } = await supabase
        .from('username_changes')
        .select('changed_at')
        .eq('user_id', user.id)
        .order('changed_at', { ascending: false })
        .limit(1);

      if (error) {
        return { canChange: false, error };
      }

      // If no previous username changes or last change was more than 30 days ago
      if (!data || data.length === 0) {
        return { canChange: true, error: null };
      }
      
      const lastChangeDate = new Date(data[0].changed_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return { canChange: lastChangeDate < thirtyDaysAgo, error: null };
    } catch (error: any) {
      return { canChange: false, error };
    }
  };

  // Update the user's profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    // If trying to update username, record the change
    if (updates.username && profile && updates.username !== profile.username) {
      // Check if the username is available
      const { available, error: availabilityError } = await checkUsernameAvailability(updates.username);
      
      if (availabilityError) {
        return { error: availabilityError };
      }
      
      if (!available) {
        return { error: { message: 'Username is already taken' } };
      }
      
      // Check if the user can change their username
      const { canChange, error: cooldownError } = await canChangeUsername();
      
      if (cooldownError) {
        return { error: cooldownError };
      }
      
      if (!canChange) {
        return { error: { message: 'Username can only be changed once every 30 days' } };
      }
      
      // Record username change in history
      const { error: historyError } = await supabase
        .from('username_changes')
        .insert({
          user_id: user.id,
          old_username: profile.username,
          new_username: updates.username
        });
      
      if (historyError) {
        return { error: historyError };
      }
    }

    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      if (error) {
        return { error };
      }

      // Refetch the profile to update state
      await fetchProfile(user.id);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // First check if the email already exists
      const { data: existingUser, error: emailCheckError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-check-password', // We're just checking if the email exists
      });

      // If sign in succeeded, the email exists
      if (existingUser?.user) {
        toast({
          title: 'Email already registered',
          description: 'This email is already registered. Please sign in instead.',
          variant: 'destructive',
        });
        return { error: { message: 'Email already registered' } };
      }

      // If the error is not about incorrect credentials, there was a different problem
      if (emailCheckError && !emailCheckError.message.includes('Invalid login credentials')) {
        console.error('Error checking email:', emailCheckError);
      }
      
      // If we reach here, the email doesn't exist, proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Sign up successful',
        description: 'Please check your email for verification link',
      });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign in a user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully',
      });
      navigate('/');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign out a user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate('/');
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Defer Supabase calls with setTimeout
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    checkUsernameAvailability,
    canChangeUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
