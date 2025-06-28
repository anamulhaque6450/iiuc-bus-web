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
        console.log('🔄 Initializing auth...');
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('✅ Session check complete:', {
          hasUser: !!session?.user,
          email: session?.user?.email,
          confirmed: !!session?.user?.email_confirmed_at
        });
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user && session.user.email_confirmed_at) {
            await fetchUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set a maximum initialization time
    const initTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('⏰ Auth initialization timeout, setting loading to false');
        setLoading(false);
      }
    }, 3000);

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', {
        event,
        hasUser: !!session?.user,
        email: session?.user?.email,
        confirmed: !!session?.user?.email_confirmed_at
      });
      
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
      clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ Profile found:', { name: data.name, role: data.role });
        setUserProfile(data);
        setLoading(false);
      } else {
        console.log('⚠️ No profile found for user:', userId);
        // Profile doesn't exist - this should have been created by the trigger
        // Let's wait a moment and try again, or create it manually
        setTimeout(async () => {
          await createUserProfileManually(userId);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const createUserProfileManually = async (userId: string) => {
    try {
      console.log('🔨 Manually creating user profile for:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Error getting user data:', userError);
        setLoading(false);
        return;
      }

      const metadata = user.user_metadata || {};
      console.log('📋 User metadata:', metadata);

      // Create profile with metadata or defaults
      const profileData = {
        id: userId,
        email: user.email!,
        name: metadata.name || 'User',
        university_id: metadata.university_id || `TEMP_${userId.substring(0, 8)}`,
        mobile: metadata.mobile || '',
        gender: metadata.gender || 'Male',
        role: metadata.role || 'student'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user profile:', error);
        setLoading(false);
        return;
      }

      console.log('✅ Profile created successfully:', data);
      setUserProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      console.log('📝 Signing up user:', email);
      
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
        console.error('❌ Auth signup error:', authError);
        return { error: authError };
      }

      console.log('✅ Signup result:', {
        hasUser: !!authData.user,
        hasSession: !!authData.session,
        needsConfirmation: !!authData.user && !authData.session
      });

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        console.log('📧 Email confirmation required');
        return { 
          error: null, 
          needsConfirmation: true 
        };
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { error };
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', identifier);
      
      // Try to sign in with email first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      // If email login fails, try to find user by university_id and use their email
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('🔍 Email login failed, trying university ID lookup');
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('university_id', identifier)
            .single();

          if (!userError && userData) {
            console.log('✅ Found email for university ID');
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password,
            });
            data = authData;
            error = authError;
          }
        } catch (fallbackError) {
          console.error('❌ University ID lookup error:', fallbackError);
        }
      }

      if (error) {
        console.error('❌ Login error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('Email not confirmed')) {
          return { error: { ...error, message: 'Please check your email and click the confirmation link before signing in.' } };
        } else if (error.message?.includes('Invalid login credentials')) {
          return { error: { ...error, message: 'Invalid email/university ID or password. Please check your credentials.' } };
        }
      } else {
        console.log('✅ Login successful:', data?.user?.email);
      }

      return { error };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
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