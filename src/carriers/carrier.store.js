import { create } from 'zustand';
import carrierApi from '../api/carrier.api';

// Demo mode flag - set to true to bypass API calls for UI testing
const DEMO_MODE = true;

// Demo Carriers Data
const DEMO_CARRIERS = [
  {
    id: 'CAR-001',
    name: 'FastFreight Logistics',
    code: 'FFL',
    email: 'contact@fastfreight.com',
    phone: '+1 (555) 123-4567',
    address: '1234 Industrial Blvd, Chicago, IL 60601',
    status: 'active',
    vehicleCount: 12,
    rating: 4.8,
    createdAt: '2025-06-15T10:00:00Z',
  },
  {
    id: 'CAR-002',
    name: 'TransGlobal Express',
    code: 'TGE',
    email: 'info@transglobal.com',
    phone: '+1 (555) 234-5678',
    address: '5678 Commerce Way, Los Angeles, CA 90001',
    status: 'active',
    vehicleCount: 8,
    rating: 4.6,
    createdAt: '2025-07-20T14:30:00Z',
  },
  {
    id: 'CAR-003',
    name: 'Metro Haulers Inc',
    code: 'MHI',
    email: 'dispatch@metrohaulers.com',
    phone: '+1 (555) 345-6789',
    address: '900 Transport Ave, New York, NY 10001',
    status: 'active',
    vehicleCount: 15,
    rating: 4.9,
    createdAt: '2025-05-10T09:15:00Z',
  },
  {
    id: 'CAR-004',
    name: 'QuickShip Carriers',
    code: 'QSC',
    email: 'support@quickship.com',
    phone: '+1 (555) 456-7890',
    address: '2200 Logistics Park, Houston, TX 77001',
    status: 'inactive',
    vehicleCount: 5,
    rating: 4.2,
    createdAt: '2025-08-05T11:45:00Z',
  },
];

// Demo Vehicles Data
const DEMO_VEHICLES = [
  {
    id: 'VEH-001',
    plateNumber: 'TRK-1234',
    type: 'truck',
    model: 'Freightliner Cascadia',
    year: 2023,
    capacity: 25000,
    capacityUnit: 'kg',
    carrierId: 'CAR-001',
    driverName: 'John Smith',
    driverPhone: '+1 (555) 111-2233',
    status: 'available',
    lastMaintenance: '2025-12-01T00:00:00Z',
    nextMaintenance: '2026-03-01T00:00:00Z',
    currentLocation: 'Chicago Warehouse',
    mileage: 45000,
  },
  {
    id: 'VEH-002',
    plateNumber: 'VAN-5678',
    type: 'van',
    model: 'Mercedes Sprinter',
    year: 2024,
    capacity: 3500,
    capacityUnit: 'kg',
    carrierId: 'CAR-001',
    driverName: 'Sarah Johnson',
    driverPhone: '+1 (555) 222-3344',
    status: 'in-use',
    lastMaintenance: '2025-11-15T00:00:00Z',
    nextMaintenance: '2026-02-15T00:00:00Z',
    currentLocation: 'En route to Detroit',
    mileage: 22000,
  },
  {
    id: 'VEH-003',
    plateNumber: 'TRK-9012',
    type: 'truck',
    model: 'Volvo VNL 860',
    year: 2022,
    capacity: 30000,
    capacityUnit: 'kg',
    carrierId: 'CAR-002',
    driverName: 'Mike Williams',
    driverPhone: '+1 (555) 333-4455',
    status: 'available',
    lastMaintenance: '2025-10-20T00:00:00Z',
    nextMaintenance: '2026-01-20T00:00:00Z',
    currentLocation: 'Los Angeles Hub',
    mileage: 78000,
  },
  {
    id: 'VEH-004',
    plateNumber: 'VAN-3456',
    type: 'van',
    model: 'Ford Transit',
    year: 2024,
    capacity: 2800,
    capacityUnit: 'kg',
    carrierId: 'CAR-002',
    driverName: 'Emily Davis',
    driverPhone: '+1 (555) 444-5566',
    status: 'maintenance',
    lastMaintenance: '2026-01-10T00:00:00Z',
    nextMaintenance: '2026-04-10T00:00:00Z',
    currentLocation: 'Service Center',
    mileage: 15000,
  },
  {
    id: 'VEH-005',
    plateNumber: 'TRK-7890',
    type: 'truck',
    model: 'Kenworth T680',
    year: 2023,
    capacity: 28000,
    capacityUnit: 'kg',
    carrierId: 'CAR-003',
    driverName: 'Robert Brown',
    driverPhone: '+1 (555) 555-6677',
    status: 'in-use',
    lastMaintenance: '2025-12-05T00:00:00Z',
    nextMaintenance: '2026-03-05T00:00:00Z',
    currentLocation: 'En route to Boston',
    mileage: 52000,
  },
  {
    id: 'VEH-006',
    plateNumber: 'TRK-2468',
    type: 'truck',
    model: 'Peterbilt 579',
    year: 2024,
    capacity: 32000,
    capacityUnit: 'kg',
    carrierId: 'CAR-003',
    driverName: 'David Martinez',
    driverPhone: '+1 (555) 666-7788',
    status: 'available',
    lastMaintenance: '2025-11-25T00:00:00Z',
    nextMaintenance: '2026-02-25T00:00:00Z',
    currentLocation: 'New York Terminal',
    mileage: 18000,
  },
  {
    id: 'VEH-007',
    plateNumber: 'VAN-1357',
    type: 'van',
    model: 'RAM ProMaster',
    year: 2023,
    capacity: 3200,
    capacityUnit: 'kg',
    carrierId: 'CAR-003',
    driverName: 'Lisa Anderson',
    driverPhone: '+1 (555) 777-8899',
    status: 'available',
    lastMaintenance: '2025-12-20T00:00:00Z',
    nextMaintenance: '2026-03-20T00:00:00Z',
    currentLocation: 'Brooklyn Depot',
    mileage: 28000,
  },
  {
    id: 'VEH-008',
    plateNumber: 'TRK-8642',
    type: 'truck',
    model: 'International LT',
    year: 2022,
    capacity: 26000,
    capacityUnit: 'kg',
    carrierId: 'CAR-004',
    driverName: 'James Wilson',
    driverPhone: '+1 (555) 888-9900',
    status: 'inactive',
    lastMaintenance: '2025-09-15T00:00:00Z',
    nextMaintenance: '2025-12-15T00:00:00Z',
    currentLocation: 'Houston Yard',
    mileage: 95000,
  },
];

/**
 * Carrier/Vehicle store using Zustand
 * Manages carrier and vehicle state and operations
 */
export const useCarrierStore = create((set, get) => ({
  // State
  carriers: [],
  vehicles: [],
  currentCarrier: null,
  currentVehicle: null,
  isLoading: false,
  error: null,

  // Carrier Actions
  /**
   * Fetch all carriers
   */
  fetchCarriers: async () => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      set({
        carriers: DEMO_CARRIERS,
        isLoading: false,
      });
      return;
    }
    
    try {
      const response = await carrierApi.getAll();
      set({
        carriers: response.carriers || response,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch carriers',
        isLoading: false,
      });
    }
  },

  /**
   * Create new carrier
   */
  createCarrier: async (carrierData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newCarrier = {
        ...carrierData,
        id: `CAR-${String(get().carriers.length + 1).padStart(3, '0')}`,
        vehicleCount: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        carriers: [newCarrier, ...state.carriers],
        isLoading: false,
      }));
      return { success: true, carrier: newCarrier };
    }
    
    try {
      const newCarrier = await carrierApi.create(carrierData);
      set((state) => ({
        carriers: [newCarrier, ...state.carriers],
        isLoading: false,
      }));
      return { success: true, carrier: newCarrier };
    } catch (error) {
      set({
        error: error.message || 'Failed to create carrier',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Update carrier
   */
  updateCarrier: async (id, carrierData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const updated = { ...get().carriers.find(c => c.id === id), ...carrierData };
      set((state) => ({
        carriers: state.carriers.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
      return { success: true, carrier: updated };
    }
    
    try {
      const updated = await carrierApi.update(id, carrierData);
      set((state) => ({
        carriers: state.carriers.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
      return { success: true, carrier: updated };
    } catch (error) {
      set({
        error: error.message || 'Failed to update carrier',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete carrier
   */
  deleteCarrier: async (id) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        carriers: state.carriers.filter((c) => c.id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
    
    try {
      await carrierApi.delete(id);
      set((state) => ({
        carriers: state.carriers.filter((c) => c.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        error: error.message || 'Failed to delete carrier',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Vehicle Actions
  /**
   * Fetch all vehicles
   */
  fetchVehicles: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({
        vehicles: DEMO_VEHICLES,
        isLoading: false,
      });
      return;
    }
    
    try {
      const response = await carrierApi.getAllVehicles(params);
      set({
        vehicles: response.vehicles || response,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch vehicles',
        isLoading: false,
      });
    }
  },

  /**
   * Get vehicle by ID
   */
  fetchVehicleById: async (id) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const vehicle = DEMO_VEHICLES.find(v => v.id === id) || get().vehicles.find(v => v.id === id);
      set({ currentVehicle: vehicle, isLoading: false });
      return vehicle;
    }
    
    try {
      const vehicle = await carrierApi.getVehicleById(id);
      set({ currentVehicle: vehicle, isLoading: false });
      return vehicle;
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch vehicle',
        isLoading: false,
      });
      return null;
    }
  },

  /**
   * Create new vehicle
   */
  createVehicle: async (vehicleData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newVehicle = {
        ...vehicleData,
        id: `VEH-${String(get().vehicles.length + 1).padStart(3, '0')}`,
        mileage: 0,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        vehicles: [newVehicle, ...state.vehicles],
        isLoading: false,
      }));
      return { success: true, vehicle: newVehicle };
    }
    
    try {
      const newVehicle = await carrierApi.createVehicle(vehicleData);
      set((state) => ({
        vehicles: [newVehicle, ...state.vehicles],
        isLoading: false,
      }));
      return { success: true, vehicle: newVehicle };
    } catch (error) {
      set({
        error: error.message || 'Failed to create vehicle',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Update vehicle
   */
  updateVehicle: async (id, vehicleData) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const updated = { ...get().vehicles.find(v => v.id === id), ...vehicleData };
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? updated : v)),
        isLoading: false,
      }));
      return { success: true, vehicle: updated };
    }
    
    try {
      const updated = await carrierApi.updateVehicle(id, vehicleData);
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? updated : v)),
        isLoading: false,
      }));
      return { success: true, vehicle: updated };
    } catch (error) {
      set({
        error: error.message || 'Failed to update vehicle',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete vehicle
   */
  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
    
    try {
      await carrierApi.deleteVehicle(id);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        error: error.message || 'Failed to delete vehicle',
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Get available vehicles
   */
  fetchAvailableVehicles: async () => {
    if (DEMO_MODE) {
      return get().vehicles.filter(v => v.status === 'available') || 
             DEMO_VEHICLES.filter(v => v.status === 'available');
    }
    
    try {
      const vehicles = await carrierApi.getAvailableVehicles();
      return vehicles;
    } catch (error) {
      console.error('Failed to fetch available vehicles:', error);
      return [];
    }
  },

  /**
   * Clear current vehicle
   */
  clearCurrentVehicle: () => set({ currentVehicle: null }),

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));

export default useCarrierStore;
