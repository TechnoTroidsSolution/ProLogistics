import axiosClient from './axiosClient';

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  /**
   * Validate token
   * @returns {Promise<boolean>}
   */
  validateToken: async () => {
    const response = await axiosClient.get('/auth/validate');
    return response.data;
  },
};

export default authApi;
