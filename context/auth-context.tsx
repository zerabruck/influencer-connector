"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { User } from '../types/shared';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: true,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const mapSupabaseUser = (supabaseUser: SupabaseUser, userData?: any): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    firstName: userData?.first_name || supabaseUser.user_metadata?.first_name,
    lastName: userData?.last_name || supabaseUser.user_metadata?.last_name,
    avatarUrl: userData?.avatar_url || supabaseUser.user_metadata?.avatar_url,
    role: userData?.role || supabaseUser.user_metadata?.role || 'INFLUENCER',
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Set user immediately from session
        setUser(mapSupabaseUser(session.user));
        
        // Then try to fetch additional data from DB (non-blocking)
        (async () => {
          try {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (data) {
              setUser(mapSupabaseUser(session.user, data));
            }
          } catch {
            // Ignore DB fetch errors
          }
        })();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Set user immediately from session
        setUser(mapSupabaseUser(session.user));
        
        // Then try to fetch additional data from DB (non-blocking)
        (async () => {
          try {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (data) {
              setUser(mapSupabaseUser(session.user, data));
            }
          } catch {
            // Ignore DB fetch errors
          }
        })();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Set user immediately from auth data, don't wait for DB fetch
    if (data.user) {
      setUser(mapSupabaseUser(data.user));
    }
    
    router.push('/dashboard');
  };

  const signup = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'INFLUENCER',
        },
      },
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
