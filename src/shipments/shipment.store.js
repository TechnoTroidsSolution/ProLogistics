import { create } from 'zustand';
import shipmentApi from '../api/shipment.api';
import { SHIPMENT_STATUS } from '../utils/constants';

// Demo mode flag - set to true to bypass API calls for UI testing
const DEMO_MODE = true;

// Demo Shipments Data
const DEMO_SHIPMENTS = [
  {
    id: 'SHP-001',
    orderId: 'ORD-2026-001',
    senderName: 'John Smith',
    senderPhone: '+1 (555) 123-4567',
    senderEmail: 'john.smith@email.com',
    origin: 'Chicago',
    originAddress: '1234 Industrial Blvd, Suite 100, Chicago, IL 60601',
    receiverName: 'Emily Davis',
    receiverPhone: '+1 (555) 987-6543',
    receiverEmail: 'emily.davis@email.com',
    destination: 'Detroit',
    destinationAddress: '5678 Commerce Drive, Detroit, MI 48201',
    packageDescription: 'Electronics - Laptop and Accessories',
    weight: 5.5,
    dimensions: '45x35x20',
    quantity: 2,
    priority: 'high',
    status: SHIPMENT_STATUS.IN_TRANSIT,
    vehicleId: 'VEH-002',
    carrierId: 'CAR-001',
    notes: 'Handle with care - Fragile items',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-11T14:30:00Z',
    estimatedDelivery: '2026-01-13T18:00:00Z',
  },
  {
    id: 'SHP-002',
    orderId: 'ORD-2026-002',
    senderName: 'Sarah Johnson',
    senderPhone: '+1 (555) 234-5678',
    senderEmail: 'sarah.j@business.com',
    origin: 'Los Angeles',
    originAddress: '900 Sunset Blvd, Los Angeles, CA 90028',
    receiverName: 'Michael Brown',
    receiverPhone: '+1 (555) 876-5432',
    receiverEmail: 'mbrown@company.com',
    destination: 'San Francisco',
    destinationAddress: '456 Market Street, San Francisco, CA 94102',
    packageDescription: 'Office Supplies and Documents',
    weight: 12.3,
    dimensions: '60x40x30',
    quantity: 5,
    priority: 'normal',
    status: SHIPMENT_STATUS.CREATED,
    vehicleId: null,
    carrierId: null,
    notes: '',
    createdAt: '2026-01-11T11:15:00Z',
    updatedAt: '2026-01-11T11:15:00Z',
    estimatedDelivery: '2026-01-15T17:00:00Z',
  },
  {
    id: 'SHP-003',
    orderId: 'ORD-2026-003',
    senderName: 'Robert Martinez',
    senderPhone: '+1 (555) 345-6789',
    senderEmail: 'rmartinez@logistics.net',
    origin: 'New York',
    originAddress: '100 Broadway, New York, NY 10005',
    receiverName: 'Lisa Anderson',
    receiverPhone: '+1 (555) 765-4321',
    receiverEmail: 'lisa.a@corp.com',
    destination: 'Boston',
    destinationAddress: '200 Beacon Street, Boston, MA 02116',
    packageDescription: 'Medical Equipment - Temperature Controlled',
    weight: 25.0,
    dimensions: '80x60x50',
    quantity: 1,
    priority: 'urgent',
    status: SHIPMENT_STATUS.IN_TRANSIT,
    vehicleId: 'VEH-005',
    carrierId: 'CAR-003',
    notes: 'Temperature sensitive - Keep at 2-8°C',
    createdAt: '2026-01-09T08:30:00Z',
    updatedAt: '2026-01-11T10:00:00Z',
    estimatedDelivery: '2026-01-12T12:00:00Z',
  },
  {
    id: 'SHP-004',
    orderId: 'ORD-2025-098',
    senderName: 'David Wilson',
    senderPhone: '+1 (555) 456-7890',
    senderEmail: 'dwilson@store.com',
    origin: 'Houston',
    originAddress: '3000 Energy Corridor, Houston, TX 77079',
    receiverName: 'Jennifer Lee',
    receiverPhone: '+1 (555) 654-3210',
    receiverEmail: 'jlee@home.net',
    destination: 'Dallas',
    destinationAddress: '1500 Main Street, Dallas, TX 75201',
    packageDescription: 'Furniture - Assembled Office Desk',
    weight: 45.0,
    dimensions: '150x80x75',
    quantity: 1,
    priority: 'low',
    status: SHIPMENT_STATUS.DELIVERED,
    vehicleId: 'VEH-003',
    carrierId: 'CAR-002',
    notes: 'Delivery completed successfully',
    createdAt: '2026-01-05T14:00:00Z',
    updatedAt: '2026-01-08T16:45:00Z',
    deliveredAt: '2026-01-08T16:45:00Z',
  },
  {
    id: 'SHP-005',
    orderId: 'ORD-2025-097',
    senderName: 'Amanda Clark',
    senderPhone: '+1 (555) 567-8901',
    senderEmail: 'aclark@fashion.com',
    origin: 'Miami',
    originAddress: '800 Ocean Drive, Miami, FL 33139',
    receiverName: 'Thomas White',
    receiverPhone: '+1 (555) 543-2109',
    receiverEmail: 'twhite@retail.com',
    destination: 'Atlanta',
    destinationAddress: '400 Peachtree Street, Atlanta, GA 30308',
    packageDescription: 'Clothing and Apparel - Fashion Items',
    weight: 8.5,
    dimensions: '50x40x35',
    quantity: 10,
    priority: 'normal',
    status: SHIPMENT_STATUS.DELIVERED,
    vehicleId: 'VEH-001',
    carrierId: 'CAR-001',
    notes: '',
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-07T11:30:00Z',
    deliveredAt: '2026-01-07T11:30:00Z',
  },
  {
    id: 'SHP-006',
    orderId: 'ORD-2026-004',
    senderName: 'Kevin Taylor',
    senderPhone: '+1 (555) 678-9012',
    senderEmail: 'ktaylor@tech.io',
    origin: 'Seattle',
    originAddress: '500 Pine Street, Seattle, WA 98101',
    receiverName: 'Rachel Green',
    receiverPhone: '+1 (555) 432-1098',
    receiverEmail: 'rgreen@startup.com',
    destination: 'Portland',
    destinationAddress: '250 Pearl District, Portland, OR 97209',
    packageDescription: 'Server Hardware - Networking Equipment',
    weight: 35.0,
    dimensions: '100x60x80',
    quantity: 3,
    priority: 'high',
    status: SHIPMENT_STATUS.PICKED_UP,
    vehicleId: 'VEH-006',
    carrierId: 'CAR-003',
    notes: 'Handle with care - Sensitive equipment',
    createdAt: '2026-01-11T07:45:00Z',
    updatedAt: '2026-01-12T09:15:00Z',
    estimatedDelivery: '2026-01-13T15:00:00Z',
  },
  {
    id: 'SHP-007',
    orderId: 'ORD-2026-005',
    senderName: 'Michelle Harris',
    senderPhone: '+1 (555) 789-0123',
    senderEmail: 'mharris@pharma.com',
    origin: 'Philadelphia',
    originAddress: '700 Market Street, Philadelphia, PA 19106',
    receiverName: 'Daniel Scott',
    receiverPhone: '+1 (555) 321-0987',
    receiverEmail: 'dscott@hospital.org',
    destination: 'Washington DC',
    destinationAddress: '1600 K Street NW, Washington, DC 20006',
    packageDescription: 'Pharmaceutical Supplies',
    weight: 15.0,
    dimensions: '55x45x40',
    quantity: 8,
    priority: 'urgent',
    status: SHIPMENT_STATUS.CREATED,
    vehicleId: null,
    carrierId: null,
    notes: 'Requires cold chain logistics',
    createdAt: '2026-01-12T06:00:00Z',
    updatedAt: '2026-01-12T06:00:00Z',
    estimatedDelivery: '2026-01-13T10:00:00Z',
  },
  {
    id: 'SHP-008',
    orderId: 'ORD-2025-096',
    senderName: 'Christopher Moore',
    senderPhone: '+1 (555) 890-1234',
    senderEmail: 'cmoore@auto.com',
    origin: 'Denver',
    originAddress: '1000 Colfax Avenue, Denver, CO 80204',
    receiverName: 'Angela Young',
    receiverPhone: '+1 (555) 210-9876',
    receiverEmail: 'ayoung@dealer.net',
    destination: 'Phoenix',
    destinationAddress: '3500 Central Avenue, Phoenix, AZ 85004',
    packageDescription: 'Auto Parts - Engine Components',
    weight: 120.0,
    dimensions: '120x100x90',
    quantity: 4,
    priority: 'normal',
    status: SHIPMENT_STATUS.CANCELLED,
    vehicleId: null,
    carrierId: null,
    notes: 'Cancelled by customer - Order changed',
    createdAt: '2026-01-02T12:00:00Z',
    updatedAt: '2026-01-04T09:00:00Z',
  },
];

// Demo Status History
const generateStatusHistory = (shipmentId, currentStatus) => {
  const baseHistory = [
    { status: SHIPMENT_STATUS.CREATED, message: 'Shipment created', timestamp: '2026-01-10T09:00:00Z' },
  ];
  
  if (currentStatus === SHIPMENT_STATUS.PICKED_UP || currentStatus === SHIPMENT_STATUS.IN_TRANSIT || currentStatus === SHIPMENT_STATUS.DELIVERED) {
    baseHistory.push({ status: SHIPMENT_STATUS.PICKED_UP, message: 'Package picked up from sender', timestamp: '2026-01-11T10:00:00Z' });
  }
  if (currentStatus === SHIPMENT_STATUS.IN_TRANSIT || currentStatus === SHIPMENT_STATUS.DELIVERED) {
    baseHistory.push({ status: SHIPMENT_STATUS.IN_TRANSIT, message: 'Shipment in transit to destination', timestamp: '2026-01-11T14:30:00Z' });
  }
  if (currentStatus === SHIPMENT_STATUS.DELIVERED) {
    baseHistory.push({ status: SHIPMENT_STATUS.DELIVERED, message: 'Package delivered successfully', timestamp: '2026-01-12T16:00:00Z' });
  }
  if (currentStatus === SHIPMENT_STATUS.CANCELLED) {
    baseHistory.push({ status: SHIPMENT_STATUS.CANCELLED, message: 'Shipment cancelled', timestamp: '2026-01-04T09:00:00Z' });
  }
  
  return baseHistory;
};

/**
 * Shipment store using Zustand
 * Manages shipment state, CRUD operations, and status updates
 */
export const useShipmentStore = create((set, get) => ({
  // State
  shipments: [],
  currentShipment: null,
  statusHistory: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    status: '',
    search: '',
  },

  // Actions
  /**
   * Fetch all shipments with current filters
   */
  fetchShipments: async () => {
    const { pagination, filters } = get();
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...DEMO_SHIPMENTS, ...get().shipments.filter(s => !DEMO_SHIPMENTS.find(d => d.id === s.id))];
      
      // Apply filters
      if (filters.status) {
        filtered = filtered.filter(s => s.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(s => 
          s.orderId.toLowerCase().includes(searchLower) ||
          s.senderName.toLowerCase().includes(searchLower) ||
          s.receiverName.toLowerCase().includes(searchLower) ||
          s.origin.toLowerCase().includes(searchLower) ||
          s.destination.toLowerCase().includes(searchLower)
        );
      }
      
      set({
        shipments: filtered,
        pagination: {
          ...pagination,
          total: filtered.length,
        },
        isLoading: false,
      });
      return;
    }
    
    try {
      const response = await shipmentApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      set({
        shipments: response.shipments || response,
        pagination: {
          ...pagination,
          total: response.total || response.length,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch shipments',
        isLoading: false,
      });
    }
  },

  /**
   * Fetch single shipment by ID
   */
  fetchShipmentById: async (id) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const shipment = DEMO_SHIPMENTS.find(s => s.id === id) || get().shipments.find(s => s.id === id);
      set({ currentShipment: shipment, isLoading: false });
      return shipment;
    }
    
    try {
      const shipment = await shipmentApi.getById(id);
      set({ currentShipment: shipment, isLoading: false });
      return shipment;
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch shipment',
        isLoading: false,
      });
      return null;
    }
  },

  /**
   * Search shipment by Order ID
   */
  searchByOrderId: async (orderId) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const shipment = DEMO_SHIPMENTS.find(s => s.orderId.toLowerCase().includes(orderId.toLowerCase()));
      set({ currentShipment: shipment, isLoading: false });
      return shipment;
    }
    
    try {
      const shipment = await shipmentApi.searchByOrderId(orderId);
      set({ currentShipment: shipment, isLoading: false });
      return shipment;
    } catch (error) {
      set({
        error: error.message || 'Shipment not found',
        isLoading: false,
      });
      return null;
    }
  },

  /**
   * Create new shipment
   */
  createShipment: async (shipmentData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const shipmentCount = get().shipments.length + DEMO_SHIPMENTS.length + 1;
      const newShipment = {
        ...shipmentData,
        id: `SHP-${String(shipmentCount).padStart(3, '0')}`,
        orderId: `ORD-2026-${String(shipmentCount).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        shipments: [newShipment, ...state.shipments],
        isLoading: false,
      }));
      return { success: true, shipment: newShipment };
    }
    
    try {
      const newShipment = await shipmentApi.create(shipmentData);
      set((state) => ({
        shipments: [newShipment, ...state.shipments],
        isLoading: false,
      }));
      return { success: true, shipment: newShipment };
    } catch (error) {
      set({
        error: error.message || 'Failed to create shipment',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Update existing shipment
   */
  updateShipment: async (id, shipmentData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const existing = DEMO_SHIPMENTS.find(s => s.id === id) || get().shipments.find(s => s.id === id);
      const updated = { ...existing, ...shipmentData, updatedAt: new Date().toISOString() };
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? updated : s)),
        currentShipment: state.currentShipment?.id === id ? updated : state.currentShipment,
        isLoading: false,
      }));
      return { success: true, shipment: updated };
    }
    
    try {
      const updated = await shipmentApi.update(id, shipmentData);
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? updated : s)),
        currentShipment: state.currentShipment?.id === id ? updated : state.currentShipment,
        isLoading: false,
      }));
      return { success: true, shipment: updated };
    } catch (error) {
      set({
        error: error.message || 'Failed to update shipment',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Update shipment status (manual status update)
   */
  updateShipmentStatus: async (id, statusData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const existing = DEMO_SHIPMENTS.find(s => s.id === id) || get().shipments.find(s => s.id === id);
      const updated = { ...existing, status: statusData.status, updatedAt: new Date().toISOString() };
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? updated : s)),
        currentShipment: state.currentShipment?.id === id ? updated : state.currentShipment,
        isLoading: false,
      }));
      get().fetchStatusHistory(id);
      return { success: true, shipment: updated };
    }
    
    try {
      const updated = await shipmentApi.updateStatus(id, statusData);
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? updated : s)),
        currentShipment: state.currentShipment?.id === id ? updated : state.currentShipment,
        isLoading: false,
      }));
      // Refresh status history
      get().fetchStatusHistory(id);
      return { success: true, shipment: updated };
    } catch (error) {
      set({
        error: error.message || 'Failed to update status',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch shipment status history (timeline)
   */
  fetchStatusHistory: async (id) => {
    if (DEMO_MODE) {
      const shipment = DEMO_SHIPMENTS.find(s => s.id === id) || get().shipments.find(s => s.id === id);
      const history = shipment ? generateStatusHistory(id, shipment.status) : [];
      set({ statusHistory: history });
      return history;
    }
    
    try {
      const history = await shipmentApi.getStatusHistory(id);
      set({ statusHistory: history });
      return history;
    } catch (error) {
      console.error('Failed to fetch status history:', error);
      return [];
    }
  },

  /**
   * Assign vehicle to shipment
   */
  assignVehicle: async (shipmentId, vehicleId) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const existing = DEMO_SHIPMENTS.find(s => s.id === shipmentId) || get().shipments.find(s => s.id === shipmentId);
      const updated = { ...existing, vehicleId, updatedAt: new Date().toISOString() };
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === shipmentId ? updated : s)),
        currentShipment: state.currentShipment?.id === shipmentId ? updated : state.currentShipment,
        isLoading: false,
      }));
      return { success: true, shipment: updated };
    }
    
    try {
      const updated = await shipmentApi.assignVehicle(shipmentId, vehicleId);
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === shipmentId ? updated : s)),
        currentShipment: state.currentShipment?.id === shipmentId ? updated : state.currentShipment,
        isLoading: false,
      }));
      return { success: true, shipment: updated };
    } catch (error) {
      set({
        error: error.message || 'Failed to assign vehicle',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete shipment
   */
  deleteShipment: async (id) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
    
    try {
      await shipmentApi.delete(id);
      set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        error: error.message || 'Failed to delete shipment',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Set filters
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  /**
   * Set pagination
   */
  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
  },

  /**
   * Clear current shipment
   */
  clearCurrentShipment: () => {
    set({ currentShipment: null, statusHistory: [] });
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Search shipment by Order ID (alias for tracking)
   */
  searchShipmentByOrderId: async (orderId) => {
    return get().searchByOrderId(orderId);
  },
}));

export default useShipmentStore;
