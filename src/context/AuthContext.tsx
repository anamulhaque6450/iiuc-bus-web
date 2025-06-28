import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User } from '../lib/supabase';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => Promise<{ error: any; needsConfirmation?: boolean }>;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.email, 'confirmed:', session?.user?.email_confirmed_at);
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user && session.user.email_confirmed_at) {
            await fetchUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email, 'confirmed:', session?.user?.email_confirmed_at);
      
      if (!mounted) return;

      setUser(session?.user ?? null);
      
      if (session?.user && session.user.email_confirmed_at) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        setUserProfile(data);
        setLoading(false);
      } else {
        console.log('No profile found, waiting for trigger...');
        // Wait a bit for the trigger to create the profile
        setTimeout(async () => {
          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (retryData) {
            console.log('Profile found on retry:', retryData);
            setUserProfile(retryData);
          } else {
            console.log('Still no profile found');
          }
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      console.log('Signing up user:', email);
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: userData.name,
            university_id: userData.university_id,
            mobile: userData.mobile,
            gender: userData.gender,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError };
      }

      console.log('Signup result:', authData);

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        console.log('Email confirmation required');
        return { 
          error: null, 
          needsConfirmation: true 
        };
      }

      // If user is immediately confirmed, the trigger will create the profile
      if (authData.user && authData.session) {
        console.log('User immediately confirmed');
        // The trigger should handle profile creation
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      console.log('Attempting login with:', identifier);
      
      // Try to sign in with email first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      // If email login fails, try to find user by university_id and use their email
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('Email login failed, trying university ID lookup');
        try {
          const { data: emailData, error: emailError } = await supabase
            .rpc('get_user_email_by_university_id', { 
              university_id_param: identifier 
            });

          if (!emailError && emailData) {
            console.log('Found email for university ID:', emailData);
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: emailData,
              password,
            });
            data = authData;
            error = authError;
          }
        } catch (fallbackError) {
          console.error('University ID lookup error:', fallbackError);
        }
      }

      if (error) {
        console.error('Login error:', error);
      } else {
        console.log('Login successful:', data?.user?.email);
      }

      return { error };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (!error && userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};