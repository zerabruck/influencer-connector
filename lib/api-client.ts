import { supabase } from './supabase';
import { DatabaseService } from './database';

// Legacy API client for backward compatibility
// Most operations should now use DatabaseService directly
export const apiClient = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data };
    },
    register: async (userData: any) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'INFLUENCER',
          },
        },
      });
      if (error) throw error;
      return { data };
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { data: { message: 'Logged out successfully' } };
    },
  },

  // Generic methods for backward compatibility
  get: async (endpoint: string) => {
    // Map common endpoints to Supabase operations
    switch (endpoint) {
      case '/campaigns':
        return { data: await DatabaseService.getCampaigns() };
      case '/profile':
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          return { data: await DatabaseService.getUserProfile(user.data.user.id) };
        }
        throw new Error('Not authenticated');
      default:
        throw new Error(`Endpoint ${endpoint} not implemented`);
    }
  },

  post: async (endpoint: string, data?: any) => {
    // Map common endpoints to Supabase operations
    switch (endpoint) {
      case '/auth/logout':
        return await apiClient.auth.logout();
      default:
        throw new Error(`Endpoint ${endpoint} not implemented`);
    }
  },

  put: async (endpoint: string, data?: any) => {
    throw new Error(`PUT ${endpoint} not implemented`);
  },

  delete: async (endpoint: string) => {
    throw new Error(`DELETE ${endpoint} not implemented`);
  },
};
