/**
 * Application Constants
 * Centralized enum-based constants for the logistics application
 */

// Shipment status enum
export const SHIPMENT_STATUS = {
  CREATED: 'Created',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

// Vehicle status enum
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
};

// Vehicle types
export const VEHICLE_TYPES = {
  TRUCK: 'Truck',
  VAN: 'Van',
  TRAILER: 'Trailer',
  CONTAINER: 'Container',
  PICKUP: 'Pickup',
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Carrier status
export const CARRIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Navigation items for sidebar
export const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    name: 'Shipments',
    path: '/shipments',
    icon: 'Package',
  },
  {
    name: 'Carriers',
    path: '/carriers',
    icon: 'Building2',
  },
  {
    name: 'Vehicles',
    path: '/vehicles',
    icon: 'Truck',
  },
];

// API Endpoints (for reference)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  SHIPMENTS: {
    BASE: '/shipments',
    SEARCH: '/shipments/search',
  },
  CARRIERS: {
    BASE: '/carriers',
  },
  VEHICLES: {
    BASE: '/vehicles',
    AVAILABLE: '/vehicles/available',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT: '/dashboard/recent-activity',
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};
