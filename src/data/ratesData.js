/**
 * Demo Shipping Rates Data
 * Pre-defined carrier rates for shipments
 * Later this will be replaced with database/API calls
 */

// Carrier base information
export const CARRIERS_DATA = [
  {
    id: 'CAR-001',
    name: 'FastFreight Express',
    code: 'FFE',
    logo: 'FF',
    rating: 4.8,
    color: '#3B82F6', // blue
  },
  {
    id: 'CAR-002',
    name: 'TransGlobal Logistics',
    code: 'TGL',
    logo: 'TG',
    rating: 4.6,
    color: '#10B981', // green
  },
  {
    id: 'CAR-003',
    name: 'Metro Haulers',
    code: 'MTH',
    logo: 'MH',
    rating: 4.4,
    color: '#F59E0B', // amber
  },
  {
    id: 'CAR-004',
    name: 'QuickShip Pro',
    code: 'QSP',
    logo: 'QS',
    rating: 4.7,
    color: '#8B5CF6', // purple
  },
  {
    id: 'CAR-005',
    name: 'United Freight',
    code: 'UFR',
    logo: 'UF',
    rating: 4.5,
    color: '#EF4444', // red
  },
  {
    id: 'CAR-006',
    name: 'Prime Logistics',
    code: 'PRL',
    logo: 'PL',
    rating: 4.9,
    color: '#06B6D4', // cyan
  },
];

// Service types with base multipliers
export const SERVICE_TYPES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Economy shipping',
    deliveryDays: { min: 5, max: 7 },
    multiplier: 1.0,
    features: ['Basic Tracking', 'Standard Insurance'],
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Fast delivery',
    deliveryDays: { min: 2, max: 3 },
    multiplier: 1.6,
    features: ['Real-time Tracking', 'Full Insurance', 'Signature Required'],
  },
  {
    id: 'priority',
    name: 'Priority',
    description: 'Fastest delivery',
    deliveryDays: { min: 1, max: 2 },
    multiplier: 2.4,
    features: ['Real-time Tracking', 'Premium Insurance', 'Signature Required', 'Priority Handling', 'Dedicated Support'],
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'Budget-friendly',
    deliveryDays: { min: 7, max: 10 },
    multiplier: 0.7,
    features: ['Basic Tracking'],
  },
  {
    id: 'overnight',
    name: 'Overnight',
    description: 'Next day delivery',
    deliveryDays: { min: 1, max: 1 },
    multiplier: 3.0,
    features: ['Real-time Tracking', 'Premium Insurance', 'Signature Required', 'Priority Handling', 'Guaranteed Delivery', '24/7 Support'],
  },
];

// Pre-defined rate cards (base rates per kg per 100 miles)
export const DEMO_RATES = [
  // FastFreight Express
  { carrierId: 'CAR-001', serviceId: 'standard', baseRate: 2.50, minCharge: 15.00 },
  { carrierId: 'CAR-001', serviceId: 'express', baseRate: 4.00, minCharge: 25.00 },
  { carrierId: 'CAR-001', serviceId: 'priority', baseRate: 6.00, minCharge: 45.00 },
  { carrierId: 'CAR-001', serviceId: 'overnight', baseRate: 8.50, minCharge: 75.00 },
  
  // TransGlobal Logistics
  { carrierId: 'CAR-002', serviceId: 'economy', baseRate: 1.80, minCharge: 10.00 },
  { carrierId: 'CAR-002', serviceId: 'standard', baseRate: 2.30, minCharge: 14.00 },
  { carrierId: 'CAR-002', serviceId: 'express', baseRate: 3.80, minCharge: 24.00 },
  { carrierId: 'CAR-002', serviceId: 'priority', baseRate: 5.50, minCharge: 40.00 },
  
  // Metro Haulers
  { carrierId: 'CAR-003', serviceId: 'economy', baseRate: 1.60, minCharge: 8.00 },
  { carrierId: 'CAR-003', serviceId: 'standard', baseRate: 2.20, minCharge: 12.00 },
  { carrierId: 'CAR-003', serviceId: 'express', baseRate: 3.50, minCharge: 22.00 },
  
  // QuickShip Pro
  { carrierId: 'CAR-004', serviceId: 'standard', baseRate: 2.40, minCharge: 14.00 },
  { carrierId: 'CAR-004', serviceId: 'express', baseRate: 3.90, minCharge: 26.00 },
  { carrierId: 'CAR-004', serviceId: 'priority', baseRate: 5.80, minCharge: 42.00 },
  { carrierId: 'CAR-004', serviceId: 'overnight', baseRate: 8.00, minCharge: 70.00 },
  
  // United Freight
  { carrierId: 'CAR-005', serviceId: 'economy', baseRate: 1.50, minCharge: 8.00 },
  { carrierId: 'CAR-005', serviceId: 'standard', baseRate: 2.10, minCharge: 12.00 },
  { carrierId: 'CAR-005', serviceId: 'express', baseRate: 3.40, minCharge: 20.00 },
  { carrierId: 'CAR-005', serviceId: 'priority', baseRate: 5.20, minCharge: 38.00 },
  
  // Prime Logistics
  { carrierId: 'CAR-006', serviceId: 'standard', baseRate: 2.80, minCharge: 18.00 },
  { carrierId: 'CAR-006', serviceId: 'express', baseRate: 4.50, minCharge: 30.00 },
  { carrierId: 'CAR-006', serviceId: 'priority', baseRate: 6.50, minCharge: 50.00 },
  { carrierId: 'CAR-006', serviceId: 'overnight', baseRate: 9.00, minCharge: 85.00 },
];

// Zone-based distance multipliers (origin-destination pairs)
export const ZONE_MULTIPLIERS = {
  'local': { multiplier: 0.8, estimatedMiles: 50 },      // Same city
  'regional': { multiplier: 1.0, estimatedMiles: 200 },  // Same state/region
  'national': { multiplier: 1.3, estimatedMiles: 800 },  // Cross-country
  'remote': { multiplier: 1.6, estimatedMiles: 1500 },   // Remote areas
};

// City zone mapping (simplified)
export const CITY_ZONES = {
  'New York': 'east',
  'Los Angeles': 'west',
  'Chicago': 'central',
  'Houston': 'south',
  'Phoenix': 'west',
  'Philadelphia': 'east',
  'San Antonio': 'south',
  'San Diego': 'west',
  'Dallas': 'south',
  'San Jose': 'west',
  'Austin': 'south',
  'Jacksonville': 'east',
  'Fort Worth': 'south',
  'Columbus': 'central',
  'Charlotte': 'east',
  'Seattle': 'west',
  'Denver': 'central',
  'Boston': 'east',
  'Detroit': 'central',
  'Miami': 'east',
  'Atlanta': 'east',
  'Portland': 'west',
  'Las Vegas': 'west',
  'Minneapolis': 'central',
};

/**
 * Calculate shipping rates based on shipment details
 * @param {Object} params - Shipment parameters
 * @param {string} params.origin - Origin city
 * @param {string} params.destination - Destination city
 * @param {number} params.weight - Package weight
 * @param {string} params.priority - Shipping priority
 * @param {string} params.carrierId - Optional carrier ID to filter results (for single carrier mode)
 * @param {string} params.accountNumber - Optional account number for negotiated rates
 * @param {string} params.paymentTerms - Payment terms (shipper, receiver, third_party)
 * @returns {Array} - Calculated rates
 */
export function calculateRates({ origin, destination, weight, priority = 'normal', carrierId = null, accountNumber = null, paymentTerms = 'shipper' }) {
  const weightKg = Number.parseFloat(weight) || 1;
  
  // Determine zone based on cities
  const originZone = CITY_ZONES[origin] || 'central';
  const destZone = CITY_ZONES[destination] || 'central';
  
  let zoneType = 'regional';
  if (originZone === destZone) {
    zoneType = origin === destination ? 'local' : 'regional';
  } else {
    const zoneDistance = Math.abs(['west', 'central', 'east', 'south'].indexOf(originZone) - 
                                   ['west', 'central', 'east', 'south'].indexOf(destZone));
    zoneType = zoneDistance > 1 ? 'national' : 'regional';
  }
  
  const zone = ZONE_MULTIPLIERS[zoneType];
  
  // Filter rates by carrier if carrierId is provided
  const filteredDemoRates = carrierId 
    ? DEMO_RATES.filter(r => r.carrierId === carrierId)
    : DEMO_RATES;
  
  // Calculate rates for each carrier-service combination
  const rates = filteredDemoRates.map(rate => {
    const carrier = CARRIERS_DATA.find(c => c.id === rate.carrierId);
    const service = SERVICE_TYPES.find(s => s.id === rate.serviceId);
    
    if (!carrier || !service) return null;
    
    // Calculate price
    const basePrice = rate.baseRate * weightKg * zone.multiplier * service.multiplier;
    const finalPrice = Math.max(basePrice, rate.minCharge);
    
    // Add small random variation (±5%) to simulate real-world pricing
    const variation = 0.95 + (Math.random() * 0.1);
    let price = Number.parseFloat((finalPrice * variation).toFixed(2));
    
    // Apply account discount for single carrier mode (negotiated rates)
    let discount = 0;
    let listPrice = price;
    if (carrierId && accountNumber) {
      // Simulate account-based discounts (10-25% off based on account)
      const discountPercent = 10 + (accountNumber.length % 16); // 10-25% discount
      discount = Number.parseFloat((price * discountPercent / 100).toFixed(2));
      price = Number.parseFloat((price - discount).toFixed(2));
    }
    
    // Calculate delivery date
    const deliveryDays = service.deliveryDays;
    const minDate = new Date(Date.now() + deliveryDays.min * 24 * 60 * 60 * 1000);
    const maxDate = new Date(Date.now() + deliveryDays.max * 24 * 60 * 60 * 1000);
    
    return {
      id: `${rate.carrierId}-${rate.serviceId}`,
      carrierId: carrier.id,
      carrierName: carrier.name,
      carrierCode: carrier.code,
      carrierLogo: carrier.logo,
      carrierColor: carrier.color,
      carrierRating: carrier.rating,
      serviceId: service.id,
      serviceType: service.name,
      serviceDescription: service.description,
      price,
      listPrice: carrierId && accountNumber ? listPrice : null,
      discount: carrierId && accountNumber ? discount : null,
      discountPercent: carrierId && accountNumber ? Math.round((discount / listPrice) * 100) : null,
      accountNumber: accountNumber || null,
      paymentTerms: paymentTerms,
      currency: 'USD',
      estimatedDays: deliveryDays.min === deliveryDays.max 
        ? `${deliveryDays.min}` 
        : `${deliveryDays.min}-${deliveryDays.max}`,
      deliveryDateMin: minDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      deliveryDateMax: maxDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      features: service.features,
      zone: zoneType,
      distance: zone.estimatedMiles,
    };
  }).filter(Boolean);
  
  // Sort by price
  rates.sort((a, b) => a.price - b.price);
  
  // Add badges
  if (rates.length > 0) {
    rates[0].badge = 'Best Value';
    
    // Find fastest option
    const fastest = rates.reduce((min, r) => {
      const days = Number.parseInt(r.estimatedDays.split('-')[0], 10);
      return days < min.days ? { rate: r, days } : min;
    }, { rate: null, days: 999 });
    
    if (fastest.rate && fastest.rate.id !== rates[0].id) {
      fastest.rate.badge = 'Fastest';
    }
    
    // Find highest rated carrier
    const highestRated = rates.reduce((max, r) => 
      r.carrierRating > max.carrierRating ? r : max, rates[0]);
    
    if (highestRated.id !== rates[0].id && !highestRated.badge) {
      highestRated.badge = 'Top Rated';
    }
  }
  
  return rates;
}

export default {
  CARRIERS_DATA,
  SERVICE_TYPES,
  DEMO_RATES,
  ZONE_MULTIPLIERS,
  CITY_ZONES,
  calculateRates,
};
