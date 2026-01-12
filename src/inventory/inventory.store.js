import { create } from 'zustand';

// Demo mode flag
const DEMO_MODE = true;

// Demo Inventory Items
const DEMO_INVENTORY = [
  {
    id: 'INV-001',
    name: 'MacBook Pro 16"',
    sku: 'APPLE-MBP16-M3',
    category: 'electronics',
    unitPrice: 2499.99,
    weight: 2.1,
    dimensions: '35x24x1.5',
    stock: 45,
    minStock: 10,
    description: 'Apple MacBook Pro 16-inch with M3 chip',
    fragile: true,
  },
  {
    id: 'INV-002',
    name: 'iPhone 15 Pro Max',
    sku: 'APPLE-IP15PM',
    category: 'electronics',
    unitPrice: 1199.99,
    weight: 0.22,
    dimensions: '16x7.5x0.8',
    stock: 120,
    minStock: 20,
    description: 'Apple iPhone 15 Pro Max 256GB',
    fragile: true,
  },
  {
    id: 'INV-003',
    name: 'Samsung 65" OLED TV',
    sku: 'SAM-OLED65-S95',
    category: 'electronics',
    unitPrice: 1799.99,
    weight: 18.5,
    dimensions: '145x83x5',
    stock: 15,
    minStock: 5,
    description: 'Samsung 65-inch S95D OLED Smart TV',
    fragile: true,
  },
  {
    id: 'INV-004',
    name: 'Sony PlayStation 5',
    sku: 'SONY-PS5-DISC',
    category: 'electronics',
    unitPrice: 499.99,
    weight: 4.5,
    dimensions: '39x26x10',
    stock: 78,
    minStock: 15,
    description: 'Sony PlayStation 5 Console Disc Edition',
    fragile: true,
  },
  {
    id: 'INV-005',
    name: 'Nike Air Max 90',
    sku: 'NIKE-AM90-WHT',
    category: 'clothing',
    unitPrice: 130.00,
    weight: 0.8,
    dimensions: '32x20x12',
    stock: 200,
    minStock: 30,
    description: 'Nike Air Max 90 White/Black',
    fragile: false,
  },
  {
    id: 'INV-006',
    name: 'Dyson V15 Vacuum',
    sku: 'DYS-V15-DETECT',
    category: 'appliances',
    unitPrice: 749.99,
    weight: 3.1,
    dimensions: '25x25x126',
    stock: 32,
    minStock: 8,
    description: 'Dyson V15 Detect Cordless Vacuum',
    fragile: false,
  },
  {
    id: 'INV-007',
    name: 'KitchenAid Stand Mixer',
    sku: 'KA-ARTISAN-5QT',
    category: 'appliances',
    unitPrice: 449.99,
    weight: 11.8,
    dimensions: '36x22x35',
    stock: 25,
    minStock: 5,
    description: 'KitchenAid Artisan 5-Quart Stand Mixer',
    fragile: true,
  },
  {
    id: 'INV-008',
    name: 'Office Chair Ergonomic',
    sku: 'FURN-ERGO-BLK',
    category: 'furniture',
    unitPrice: 399.99,
    weight: 22.5,
    dimensions: '70x70x120',
    stock: 18,
    minStock: 5,
    description: 'Ergonomic Office Chair with Lumbar Support',
    fragile: false,
  },
  {
    id: 'INV-009',
    name: 'Medical Test Kit',
    sku: 'MED-TEST-MULTI',
    category: 'medical',
    unitPrice: 89.99,
    weight: 0.5,
    dimensions: '20x15x8',
    stock: 500,
    minStock: 100,
    description: 'Multi-panel Medical Testing Kit',
    fragile: true,
  },
  {
    id: 'INV-010',
    name: 'Legal Documents Bundle',
    sku: 'DOC-LEGAL-PKG',
    category: 'documents',
    unitPrice: 0,
    weight: 0.3,
    dimensions: '32x24x2',
    stock: 1000,
    minStock: 50,
    description: 'Confidential Legal Documents Package',
    fragile: false,
  },
  {
    id: 'INV-011',
    name: 'Wine Collection (6 Bottles)',
    sku: 'WINE-PREMIUM-6',
    category: 'hazardous',
    unitPrice: 299.99,
    weight: 8.5,
    dimensions: '40x28x32',
    stock: 8,
    minStock: 10,
    description: 'Premium Wine Collection - 6 Bottle Set',
    fragile: true,
  },
  {
    id: 'INV-012',
    name: 'Lithium Battery Pack',
    sku: 'BATT-LI-100WH',
    category: 'hazardous',
    unitPrice: 199.99,
    weight: 1.2,
    dimensions: '18x12x6',
    stock: 0,
    minStock: 20,
    description: 'High-capacity Lithium Battery Pack 100Wh',
    fragile: false,
  },
  {
    id: 'INV-013',
    name: 'Dell XPS 15 Laptop',
    sku: 'DELL-XPS15-I9',
    category: 'electronics',
    unitPrice: 1899.99,
    weight: 1.8,
    dimensions: '34x23x1.8',
    stock: 55,
    minStock: 10,
    description: 'Dell XPS 15 Intel Core i9, 32GB RAM',
    fragile: true,
  },
  {
    id: 'INV-014',
    name: 'Canon EOS R5 Camera',
    sku: 'CANON-EOSR5',
    category: 'electronics',
    unitPrice: 3899.99,
    weight: 0.74,
    dimensions: '14x10x9',
    stock: 22,
    minStock: 5,
    description: 'Canon EOS R5 Mirrorless Camera Body',
    fragile: true,
  },
  {
    id: 'INV-015',
    name: 'Adidas Ultraboost',
    sku: 'ADIDAS-UB23',
    category: 'clothing',
    unitPrice: 189.99,
    weight: 0.65,
    dimensions: '32x20x12',
    stock: 150,
    minStock: 25,
    description: 'Adidas Ultraboost 23 Running Shoes',
    fragile: false,
  },
];

/**
 * Inventory store using Zustand
 * Manages inventory items for package selection
 */
export const useInventoryStore = create((set, get) => ({
  // State
  items: [],
  inventory: [], // Alias for items
  isLoading: false,
  loading: false, // Alias for isLoading
  error: null,
  searchQuery: '',
  categoryFilter: '',

  /**
   * Fetch all inventory items
   */
  fetchInventory: async () => {
    set({ isLoading: true, loading: true, error: null });
    
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      set({
        items: DEMO_INVENTORY,
        inventory: DEMO_INVENTORY,
        isLoading: false,
        loading: false,
      });
      return;
    }
    
    // API call would go here
    set({ isLoading: false, loading: false });
  },

  /**
   * Search inventory items
   */
  searchInventory: (query) => {
    set({ searchQuery: query });
  },

  /**
   * Filter by category
   */
  filterByCategory: (category) => {
    set({ categoryFilter: category });
  },

  /**
   * Get filtered items
   */
  getFilteredItems: () => {
    const { items, searchQuery, categoryFilter } = get();
    let filtered = [...items];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    return filtered;
  },

  /**
   * Get item by ID
   */
  getItemById: (id) => {
    return get().items.find(item => item.id === id);
  },

  /**
   * Update stock (when items are shipped)
   */
  updateStock: async (itemId, newStock) => {
    if (DEMO_MODE) {
      set((state) => ({
        items: state.items.map(item => 
          item.id === itemId 
            ? { ...item, stock: Math.max(0, newStock) }
            : item
        ),
        inventory: state.inventory.map(item => 
          item.id === itemId 
            ? { ...item, stock: Math.max(0, newStock) }
            : item
        ),
      }));
      return { success: true };
    }
    
    return { success: false };
  },

  /**
   * Delete inventory item
   */
  deleteItem: async (itemId) => {
    if (DEMO_MODE) {
      set((state) => ({
        items: state.items.filter(item => item.id !== itemId),
        inventory: state.inventory.filter(item => item.id !== itemId),
      }));
      return { success: true };
    }
    
    return { success: false };
  },

  /**
   * Add new inventory item
   */
  addItem: async (newItem) => {
    if (DEMO_MODE) {
      const item = {
        ...newItem,
        id: `INV-${String(get().items.length + 1).padStart(3, '0')}`,
      };
      set((state) => ({
        items: [...state.items, item],
        inventory: [...state.inventory, item],
      }));
      return { success: true, item };
    }
    
    return { success: false };
  },

  /**
   * Clear filters
   */
  clearFilters: () => {
    set({ searchQuery: '', categoryFilter: '' });
  },
}));

export default useInventoryStore;
