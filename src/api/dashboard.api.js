import axiosClient from './axiosClient';
import { DASHBOARD_DATA } from '../data/dashboard-data';

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
    try {
      const response = await axiosClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      // Return demo data if API fails
      return DASHBOARD_DATA.stats;
    }
  },

  /**
   * Get recent shipment activity
   * @param {number} limit - Number of recent activities to fetch
   * @returns {Promise<Array>} Recent activity list
   */
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await axiosClient.get('/dashboard/recent-activity', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      // Return demo data
      return DASHBOARD_DATA.recentActivity;
    }
  },

  /**
   * Get shipment counts by status
   * @returns {Promise<Object>} Status counts
   */
  getStatusCounts: async () => {
    try {
      const response = await axiosClient.get('/dashboard/status-counts');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.statusCounts;
    }
  },

  /**
   * Get overview data for dashboard widgets
   * @returns {Promise<Object>} Combined dashboard data
   */
  getOverview: async () => {
    try {
      const response = await axiosClient.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.overview;
    }
  },

  /**
   * Get operational alerts requiring attention
   * @returns {Promise<Array>} Operational alerts
   */
  getOperationalAlerts: async () => {
    try {
      const response = await axiosClient.get('/dashboard/operational-alerts');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.operationalAlerts;
    }
  },

  /**
   * Get today's schedule (pickups, deliveries, assignments)
   * @returns {Promise<Object>} Today's schedule
   */
  getTodaySchedule: async () => {
    try {
      const response = await axiosClient.get('/dashboard/today-schedule');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.todaySchedule;
    }
  },

  /**
   * Get pending actions requiring user attention
   * @returns {Promise<Array>} Pending actions
   */
  getPendingActions: async () => {
    try {
      const response = await axiosClient.get('/dashboard/pending-actions');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.pendingActions;
    }
  },

  /**
   * Get vehicle fleet status
   * @returns {Promise<Object>} Vehicle status
   */
  getVehicleStatus: async () => {
    try {
      const response = await axiosClient.get('/dashboard/vehicle-status');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.vehicleStatus;
    }
  },

  /**
   * Get customer service queue
   * @returns {Promise<Array>} Customer service items
   */
  getCustomerServiceQueue: async () => {
    try {
      const response = await axiosClient.get('/dashboard/customer-service-queue');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.customerServiceQueue;
    }
  },

  /**
   * Get system notifications
   * @returns {Promise<Array>} System notifications
   */
  getSystemNotifications: async () => {
    try {
      const response = await axiosClient.get('/dashboard/system-notifications');
      return response.data;
    } catch (error) {
      return DASHBOARD_DATA.systemNotifications;
    }
  },
};

export default dashboardApi;
