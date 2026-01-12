import axiosClient from './axiosClient';

/**
 * Carrier/Vehicle API endpoints
 */
export const carrierApi = {
  /**
   * Get all carriers
   * @param {Object} params - Query parameters { page, limit, search }
   * @returns {Promise<{ carriers: Array, total: number }>}
   */
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/carriers', { params });
    return response.data;
  },

  /**
   * Get carrier by ID
   * @param {string} id - Carrier ID
   * @returns {Promise<Object>} Carrier details
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/carriers/${id}`);
    return response.data;
  },

  /**
   * Create new carrier
   * @param {Object} carrierData - Carrier creation payload
   * @returns {Promise<Object>} Created carrier
   */
  create: async (carrierData) => {
    const response = await axiosClient.post('/carriers', carrierData);
    return response.data;
  },

  /**
   * Update carrier
   * @param {string} id - Carrier ID
   * @param {Object} carrierData - Updated carrier data
   * @returns {Promise<Object>} Updated carrier
   */
  update: async (id, carrierData) => {
    const response = await axiosClient.put(`/carriers/${id}`, carrierData);
    return response.data;
  },

  /**
   * Delete carrier
   * @param {string} id - Carrier ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const response = await axiosClient.delete(`/carriers/${id}`);
    return response.data;
  },

  // ============ Vehicle Endpoints ============

  /**
   * Get all vehicles
   * @param {Object} params - Query parameters { carrierId, status, page, limit }
   * @returns {Promise<{ vehicles: Array, total: number }>}
   */
  getAllVehicles: async (params = {}) => {
    const response = await axiosClient.get('/vehicles', { params });
    return response.data;
  },

  /**
   * Get vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   */
  getVehicleById: async (id) => {
    const response = await axiosClient.get(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Create new vehicle
   * @param {Object} vehicleData - Vehicle creation payload
   * @returns {Promise<Object>} Created vehicle
   */
  createVehicle: async (vehicleData) => {
    const response = await axiosClient.post('/vehicles', vehicleData);
    return response.data;
  },

  /**
   * Update vehicle
   * @param {string} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise<Object>} Updated vehicle
   */
  updateVehicle: async (id, vehicleData) => {
    const response = await axiosClient.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  /**
   * Get available vehicles (not assigned to active shipments)
   * @returns {Promise<Array>} List of available vehicles
   */
  getAvailableVehicles: async () => {
    const response = await axiosClient.get('/vehicles/available');
    return response.data;
  },

  /**
   * Delete vehicle
   * @param {string} id - Vehicle ID
   * @returns {Promise<void>}
   */
  deleteVehicle: async (id) => {
    const response = await axiosClient.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export default carrierApi;
