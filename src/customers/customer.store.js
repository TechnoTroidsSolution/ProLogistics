import { create } from 'zustand';

// Demo customer data
const demoCustomers = [
  {
    id: 'CUS-001',
    name: 'TechCorp Industries',
    type: 'business',
    email: 'shipping@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '456 Tech Plaza, San Francisco, CA 94102',
    contactPerson: 'John Smith',
    contactRole: 'Logistics Manager',
    status: 'active',
    creditLimit: 50000,
    currentBalance: 12500,
    paymentTerms: 'Net 30',
    taxId: 'XX-XXXXXXX',
    notes: 'Preferred customer, high volume shipper',
    createdAt: '2024-06-15T10:00:00Z',
    totalShipments: 156,
    totalSpend: 45600,
    lastShipment: '2026-01-08T14:30:00Z',
  },
  {
    id: 'CUS-002',
    name: 'Global Retail Co',
    type: 'business',
    email: 'logistics@globalretail.com',
    phone: '+1 (555) 234-5678',
    address: '789 Commerce Blvd, Los Angeles, CA 90001',
    contactPerson: 'Sarah Johnson',
    contactRole: 'Supply Chain Director',
    status: 'active',
    creditLimit: 100000,
    currentBalance: 8750,
    paymentTerms: 'Net 45',
    taxId: 'XX-XXXXXXX',
    notes: 'Multi-location deliveries',
    createdAt: '2024-03-20T08:00:00Z',
    totalShipments: 342,
    totalSpend: 125000,
    lastShipment: '2026-01-10T09:15:00Z',
  },
  {
    id: 'CUS-003',
    name: 'Michael Brown',
    type: 'individual',
    email: 'mbrown@email.com',
    phone: '+1 (555) 345-6789',
    address: '123 Oak Street, Chicago, IL 60601',
    status: 'active',
    creditLimit: 5000,
    currentBalance: 0,
    paymentTerms: 'Prepaid',
    createdAt: '2025-01-10T16:00:00Z',
    totalShipments: 8,
    totalSpend: 1250,
    lastShipment: '2026-01-05T11:20:00Z',
  },
  {
    id: 'CUS-004',
    name: 'MedSupply Inc',
    type: 'business',
    email: 'orders@medsupply.com',
    phone: '+1 (555) 456-7890',
    address: '321 Healthcare Way, Boston, MA 02101',
    contactPerson: 'Dr. Emily Chen',
    contactRole: 'Operations Director',
    status: 'active',
    creditLimit: 75000,
    currentBalance: 22000,
    paymentTerms: 'Net 30',
    taxId: 'XX-XXXXXXX',
    notes: 'Temperature-controlled shipments required',
    createdAt: '2024-09-01T12:00:00Z',
    totalShipments: 89,
    totalSpend: 67800,
    lastShipment: '2026-01-09T08:45:00Z',
    specialRequirements: ['temperature-controlled', 'fragile', 'priority'],
  },
  {
    id: 'CUS-005',
    name: 'E-Commerce Solutions',
    type: 'business',
    email: 'fulfillment@ecommerce.com',
    phone: '+1 (555) 567-8901',
    address: '555 Digital Drive, Seattle, WA 98101',
    contactPerson: 'Alex Rivera',
    contactRole: 'Fulfillment Manager',
    status: 'inactive',
    creditLimit: 30000,
    currentBalance: 5200,
    paymentTerms: 'Net 30',
    taxId: 'XX-XXXXXXX',
    notes: 'Account under review',
    createdAt: '2024-11-15T14:00:00Z',
    totalShipments: 45,
    totalSpend: 18900,
    lastShipment: '2025-12-20T10:30:00Z',
  },
];

export const useCustomerStore = create((set, get) => ({
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,

  // Demo mode flag
  isDemoMode: true,

  // Stats
  stats: {
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    averageSpend: 0,
  },

  // Fetch all customers
  fetchCustomers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...demoCustomers];
    
    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search)
      );
    }
    
    // Calculate stats
    const stats = {
      totalCustomers: demoCustomers.length,
      activeCustomers: demoCustomers.filter(c => c.status === 'active').length,
      totalRevenue: demoCustomers.reduce((sum, c) => sum + c.totalSpend, 0),
      averageSpend: Math.round(demoCustomers.reduce((sum, c) => sum + c.totalSpend, 0) / demoCustomers.length),
    };
    
    set({ customers: filtered, stats, isLoading: false });
  },

  // Fetch single customer by ID
  fetchCustomerById: async (id) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const customer = demoCustomers.find(c => c.id === id);
    
    if (!customer) {
      set({ error: 'Customer not found', isLoading: false });
      return null;
    }
    
    set({ currentCustomer: customer, isLoading: false });
    return customer;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newCustomer = {
      id: `CUS-${String(demoCustomers.length + 1).padStart(3, '0')}`,
      ...customerData,
      status: 'active',
      creditLimit: customerData.creditLimit || 10000,
      currentBalance: 0,
      paymentTerms: customerData.paymentTerms || 'Net 30',
      createdAt: new Date().toISOString(),
      totalShipments: 0,
      totalSpend: 0,
    };
    
    demoCustomers.push(newCustomer);
    
    set({ isLoading: false });
    return newCustomer;
  },

  // Update customer
  updateCustomer: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = demoCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      demoCustomers[index] = { ...demoCustomers[index], ...updates };
      set({ currentCustomer: demoCustomers[index], isLoading: false });
      return demoCustomers[index];
    }
    
    set({ error: 'Customer not found', isLoading: false });
    return null;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = demoCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      demoCustomers.splice(index, 1);
    }
    
    // Refresh list
    await get().fetchCustomers();
    set({ isLoading: false });
  },

  // Update customer status
  updateCustomerStatus: async (id, status) => {
    return get().updateCustomer(id, { status });
  },

  // Search customers for autocomplete
  searchCustomers: async (query) => {
    if (!query || query.length < 2) return [];
    
    const search = query.toLowerCase();
    return demoCustomers.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search)
    ).slice(0, 5);
  },

  // Get customer shipments (mock)
  getCustomerShipments: async (customerId) => {
    // This would normally fetch from shipment API
    return [];
  },

  // Get customer invoices (mock)
  getCustomerInvoices: async (customerId) => {
    // This would normally fetch from billing API
    return [];
  },

  // Clear current customer
  clearCurrentCustomer: () => set({ currentCustomer: null }),
}));
