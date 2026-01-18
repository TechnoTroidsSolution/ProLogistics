import { create } from 'zustand';

// Demo mode
const DEMO_MODE = true;

// Demo invoices data
const DEMO_INVOICES = [
  {
    id: 'INV-2026-001',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    shipmentIds: ['SHP-001', 'SHP-002'],
    items: [
      { description: 'Shipment SHP-001: Chicago → Detroit', quantity: 1, unitPrice: 125.50, total: 125.50 },
      { description: 'Shipment SHP-002: Los Angeles → San Francisco', quantity: 1, unitPrice: 89.00, total: 89.00 },
      { description: 'Insurance Premium', quantity: 2, unitPrice: 15.00, total: 30.00 },
    ],
    subtotal: 244.50,
    tax: 19.56,
    discount: 0,
    total: 264.06,
    status: 'paid',
    paymentMethod: 'credit_card',
    paidAt: '2026-01-12T10:30:00Z',
    dueDate: '2026-01-25T00:00:00Z',
    createdAt: '2026-01-10T09:00:00Z',
    notes: '',
  },
  {
    id: 'INV-2026-002',
    customerId: 'CUST-002',
    customerName: 'Global Trade Inc',
    customerEmail: 'accounts@globaltrade.com',
    shipmentIds: ['SHP-003'],
    items: [
      { description: 'Shipment SHP-003: New York → Boston (Priority)', quantity: 1, unitPrice: 245.00, total: 245.00 },
      { description: 'Cold Chain Handling', quantity: 1, unitPrice: 75.00, total: 75.00 },
      { description: 'Insurance Premium (Medical)', quantity: 1, unitPrice: 50.00, total: 50.00 },
    ],
    subtotal: 370.00,
    tax: 29.60,
    discount: 37.00,
    total: 362.60,
    status: 'pending',
    paymentMethod: null,
    paidAt: null,
    dueDate: '2026-01-20T00:00:00Z',
    createdAt: '2026-01-11T14:00:00Z',
    notes: '10% volume discount applied',
  },
  {
    id: 'INV-2026-003',
    customerId: 'CUST-003',
    customerName: 'Tech Solutions LLC',
    customerEmail: 'finance@techsolutions.com',
    shipmentIds: ['SHP-006'],
    items: [
      { description: 'Shipment SHP-006: Seattle → Portland', quantity: 1, unitPrice: 156.00, total: 156.00 },
      { description: 'Fragile Handling Fee', quantity: 1, unitPrice: 25.00, total: 25.00 },
    ],
    subtotal: 181.00,
    tax: 14.48,
    discount: 0,
    total: 195.48,
    status: 'overdue',
    paymentMethod: null,
    paidAt: null,
    dueDate: '2026-01-10T00:00:00Z',
    createdAt: '2026-01-05T11:00:00Z',
    notes: '',
  },
  {
    id: 'INV-2026-004',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    shipmentIds: ['SHP-007'],
    items: [
      { description: 'Shipment SHP-007: Philadelphia → Washington DC', quantity: 1, unitPrice: 198.00, total: 198.00 },
      { description: 'Express Delivery Surcharge', quantity: 1, unitPrice: 45.00, total: 45.00 },
    ],
    subtotal: 243.00,
    tax: 19.44,
    discount: 0,
    total: 262.44,
    status: 'draft',
    paymentMethod: null,
    paidAt: null,
    dueDate: '2026-01-30T00:00:00Z',
    createdAt: '2026-01-14T08:00:00Z',
    notes: 'Awaiting shipment completion',
  },
];

// Demo payments data
const DEMO_PAYMENTS = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-2026-001',
    amount: 264.06,
    method: 'credit_card',
    cardLast4: '4242',
    status: 'completed',
    transactionId: 'TXN-789456123',
    processedAt: '2026-01-12T10:30:00Z',
  },
];

/**
 * Billing store using Zustand
 * Manages invoices, payments, and billing operations
 */
export const useBillingStore = create((set, get) => ({
  // State
  invoices: [],
  payments: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  stats: {
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    paidThisMonth: 0,
  },

  // Fetch all invoices
  fetchInvoices: async (filters = {}) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = [...DEMO_INVOICES];
      
      if (filters.status) {
        filtered = filtered.filter(inv => inv.status === filters.status);
      }
      if (filters.customerId) {
        filtered = filtered.filter(inv => inv.customerId === filters.customerId);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(inv => 
          inv.id.toLowerCase().includes(search) ||
          inv.customerName.toLowerCase().includes(search)
        );
      }

      // Calculate stats
      const stats = {
        totalRevenue: DEMO_INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
        pendingAmount: DEMO_INVOICES.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0),
        overdueAmount: DEMO_INVOICES.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0),
        paidThisMonth: DEMO_INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
      };

      set({ invoices: filtered, stats, isLoading: false });
      return filtered;
    }
  },

  // Fetch single invoice
  fetchInvoiceById: async (id) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const invoice = DEMO_INVOICES.find(i => i.id === id);
      set({ currentInvoice: invoice, isLoading: false });
      return invoice;
    }
  },

  // Create invoice from shipment
  createInvoiceFromShipment: async (shipment, customer, additionalItems = []) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const invoiceCount = get().invoices.length + DEMO_INVOICES.length + 1;
      const items = [
        {
          description: `Shipment ${shipment.orderId}: ${shipment.origin} → ${shipment.destination}`,
          quantity: 1,
          unitPrice: shipment.rate || 100.00,
          total: shipment.rate || 100.00,
        },
        ...additionalItems,
      ];

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      const newInvoice = {
        id: `INV-2026-${String(invoiceCount).padStart(3, '0')}`,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        shipmentIds: [shipment.id],
        items,
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'draft',
        paymentMethod: null,
        paidAt: null,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        notes: '',
      };

      set(state => ({
        invoices: [newInvoice, ...state.invoices],
        currentInvoice: newInvoice,
        isLoading: false,
      }));

      return { success: true, invoice: newInvoice };
    }
  },

  // Create manual invoice
  createInvoice: async (invoiceData) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const invoiceCount = get().invoices.length + DEMO_INVOICES.length + 1;
      const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax - (invoiceData.discount || 0);

      const newInvoice = {
        ...invoiceData,
        id: `INV-2026-${String(invoiceCount).padStart(3, '0')}`,
        subtotal,
        tax,
        total,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      set(state => ({
        invoices: [newInvoice, ...state.invoices],
        isLoading: false,
      }));

      return { success: true, invoice: newInvoice };
    }
  },

  // Update invoice status
  updateInvoiceStatus: async (id, status) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => ({
        invoices: state.invoices.map(inv =>
          inv.id === id ? { ...inv, status } : inv
        ),
        currentInvoice: state.currentInvoice?.id === id 
          ? { ...state.currentInvoice, status }
          : state.currentInvoice,
        isLoading: false,
      }));

      return { success: true };
    }
  },

  // Record payment
  recordPayment: async (invoiceId, paymentData) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const payment = {
        id: `PAY-${String(Date.now()).slice(-6)}`,
        invoiceId,
        ...paymentData,
        status: 'completed',
        processedAt: new Date().toISOString(),
      };

      set(state => ({
        payments: [payment, ...state.payments],
        invoices: state.invoices.map(inv =>
          inv.id === invoiceId 
            ? { ...inv, status: 'paid', paidAt: payment.processedAt, paymentMethod: paymentData.method }
            : inv
        ),
        isLoading: false,
      }));

      return { success: true, payment };
    }
  },

  // Send invoice email
  sendInvoice: async (invoiceId) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        invoices: state.invoices.map(inv =>
          inv.id === invoiceId && inv.status === 'draft'
            ? { ...inv, status: 'pending' }
            : inv
        ),
        isLoading: false,
      }));

      return { success: true, message: 'Invoice sent successfully' };
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    set({ isLoading: true, error: null });

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => ({
        invoices: state.invoices.filter(inv => inv.id !== id),
        isLoading: false,
      }));

      return { success: true };
    }
  },

  // Clear current invoice
  clearCurrentInvoice: () => set({ currentInvoice: null }),
}));

export default useBillingStore;
