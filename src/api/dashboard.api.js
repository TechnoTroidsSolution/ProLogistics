import axiosClient from './axiosClient';

/**
 * Dashboard API endpoints
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   * {
   *   totalShipments: number,
   *   activeShipments: number,
   *   deliveredShipments: number,
   *   createdShipments: number,
   *   inTransitShipments: number
   * }
   */
  getStats: async () => {
    const response = await axiosClient.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get recent shipment activity
   * @param {number} limit - Number of recent activities to fetch
   * @returns {Promise<Array>} Recent activity list
   */
  getRecentActivity: async (limit = 10) => {
    const response = await axiosClient.get('/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get shipment counts by status
   * @returns {Promise<Object>} Status counts
   */
  getStatusCounts: async () => {
    const response = await axiosClient.get('/dashboard/status-counts');
    return response.data;
  },

  /**
   * Get overview data for dashboard widgets
   * @returns {Promise<Object>} Combined dashboard data
   */
  getOverview: async () => {
    const response = await axiosClient.get('/dashboard/overview');
    return response.data;
  },
};

export default dashboardApi;
