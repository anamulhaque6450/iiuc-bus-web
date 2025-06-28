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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && session.user.email_confirmed_at) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user && session.user.email_confirmed_at) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use a simple query without RLS complications
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors if no profile exists

      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      // First, sign up the user with Supabase Auth
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
        return { error: authError };
      }

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        return { 
          error: null, 
          needsConfirmation: true 
        };
      }

      // If user is immediately confirmed, create profile
      if (authData.user && authData.session) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: authData.user.email!,
                ...userData,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't return error here as auth was successful
          }
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      setLoading(true);
      
      // Try to sign in with email first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      // If email login fails, try to find user by university_id and use their email
      if (error && error.message.includes('Invalid login credentials')) {
        try {
          // Use a direct query to avoid RLS issues
          const { data: userData, error: userError } = await supabase
            .rpc('get_user_email_by_university_id', { 
              university_id_param: identifier 
            });

          if (!userError && userData) {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: userData,
              password,
            });
            data = authData;
            error = authError;
          }
        } catch (fallbackError) {
          console.error('Fallback login error:', fallbackError);
        }
      }

      return { error };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
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