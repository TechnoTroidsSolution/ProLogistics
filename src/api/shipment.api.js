import axiosClient from './axiosClient';

/**
 * Shipment API endpoints
 */
export const shipmentApi = {
  /**
   * Get all shipments with optional filters
   * @param {Object} params - Query parameters { status, search, page, limit }
   * @returns {Promise<{ shipments: Array, total: number, page: number }>}
   */
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/shipments', { params });
    return response.data;
  },

  /**
   * Get shipment by ID
   * @param {string} id - Shipment ID
   * @returns {Promise<Object>} Shipment details
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/shipments/${id}`);
    return response.data;
  },

  /**
   * Search shipment by Order ID
   * @param {string} orderId - Order ID to search
   * @returns {Promise<Object>} Shipment details
   */
  searchByOrderId: async (orderId) => {
    const response = await axiosClient.get('/shipments/search', { 
      params: { orderId } 
    });
    return response.data;
  },

  /**
   * Create new shipment
   * @param {Object} shipmentData - Shipment creation payload
   * @returns {Promise<Object>} Created shipment
   */
  create: async (shipmentData) => {
    const response = await axiosClient.post('/shipments', shipmentData);
    return response.data;
  },

  /**
   * Update shipment
   * @param {string} id - Shipment ID
   * @param {Object} shipmentData - Updated shipment data
   * @returns {Promise<Object>} Updated shipment
   */
  update: async (id, shipmentData) => {
    const response = await axiosClient.put(`/shipments/${id}`, shipmentData);
    return response.data;
  },

  /**
   * Update shipment status (manual status update)
   * @param {string} id - Shipment ID
   * @param {Object} statusData - { status, notes, location }
   * @returns {Promise<Object>} Updated shipment with new status
   */
  updateStatus: async (id, statusData) => {
    const response = await axiosClient.patch(`/shipments/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Get shipment status history (timeline)
   * @param {string} id - Shipment ID
   * @returns {Promise<Array>} Status history array
   */
  getStatusHistory: async (id) => {
    const response = await axiosClient.get(`/shipments/${id}/history`);
    return response.data;
  },

  /**
   * Assign vehicle/carrier to shipment
   * @param {string} shipmentId - Shipment ID
   * @param {string} vehicleId - Vehicle ID to assign
   * @returns {Promise<Object>} Updated shipment
   */
  assignVehicle: async (shipmentId, vehicleId) => {
    const response = await axiosClient.patch(`/shipments/${shipmentId}/assign-vehicle`, {
      vehicleId,
    });
    return response.data;
  },

  /**
   * Delete shipment
   * @param {string} id - Shipment ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const response = await axiosClient.delete(`/shipments/${id}`);
    return response.data;
  },
};

export default shipmentApi;
