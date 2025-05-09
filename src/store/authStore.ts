import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  isAuthenticated: false,
  
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        await get().loadUser();
        return { error: null };
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      toast.error('Failed to sign in. Please try again.');
      return { error: err };
    }
  },
  
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (!error && data.user) {
        // Create a profile for the new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'user', // Default role is user
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }
        
        await get().loadUser();
        return { error: null };
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      toast.error('Failed to create account. Please try again.');
      return { error: err };
    }
  },
  
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, isAdmin: false, isAuthenticated: false });
      
      // Redirect to homepage after logout
      window.location.href = '/';
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('Failed to sign out. Please try again.');
    }
  },
  
  loadUser: async () => {
    set({ isLoading: true });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // If profile doesn't exist but user does, create a default profile
          if (error.code === 'PGRST116') {
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || null,
                role: 'user'
              });
              
            if (createError) {
              console.error('Error creating profile:', createError);
              set({ user: null, profile: null, isAdmin: false, isAuthenticated: false, isLoading: false });
              return;
            } else {
              // Fetch the newly created profile
              const { data: newProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (fetchError) {
                console.error('Error fetching new profile:', fetchError);
                set({ user: null, profile: null, isAdmin: false, isAuthenticated: false, isLoading: false });
                return;
              }
                
              set({
                user: session.user,
                profile: newProfile || null,
                isAdmin: newProfile?.role === 'admin',
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          } else {
            set({ user: null, profile: null, isAdmin: false, isAuthenticated: false, isLoading: false });
            return;
          }
        }
        
        set({
          user: session.user,
          profile,
          isAdmin: profile?.role === 'admin',
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, profile: null, isAdmin: false, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      set({ user: null, profile: null, isAdmin: false, isAuthenticated: false, isLoading: false });
    }
  },
}));