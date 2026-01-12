import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/auth.api';

// Demo mode - set to true to bypass API calls
const DEMO_MODE = true;

// Demo user for testing
const DEMO_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@logistics.com',
  role: 'Administrator',
};

/**
 * Authentication store using Zustand
 * Handles user state, token management, and auth operations
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      /**
       * Login user with credentials
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        // Demo mode - bypass API
        if (DEMO_MODE) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
          if (email === 'admin@logistics.com' && password === 'admin123') {
            set({
              user: DEMO_USER,
              token: 'demo-token-12345',
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: 'Invalid email or password',
            });
            return { success: false, error: 'Invalid credentials' };
          }
        }
        
        try {
          const { user, token } = await authApi.login({ email, password });
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Logout user and clear state
       */
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Continue with local logout even if API fails
          console.warn('Logout API call failed:', error);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Refresh user data from server
       */
      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          // Token might be invalid - logout
          get().logout();
        }
      },

      /**
       * Check if token is still valid
       */
      validateSession: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          await authApi.validateToken();
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),

      /**
       * Set loading state
       */
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'logistics-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
