/**
 * Tracking Data - City coordinates and route generation utilities
 */

// Major US city coordinates [lat, lng]
export const CITY_COORDINATES = {
  'Chicago': [41.8781, -87.6298],
  'Detroit': [42.3314, -83.0458],
  'Los Angeles': [34.0522, -118.2437],
  'San Francisco': [37.7749, -122.4194],
  'New York': [40.7128, -74.0060],
  'Boston': [42.3601, -71.0589],
  'Houston': [29.7604, -95.3698],
  'Dallas': [32.7767, -96.7970],
  'Miami': [25.7617, -80.1918],
  'Atlanta': [33.7490, -84.3880],
  'Seattle': [47.6062, -122.3321],
  'Portland': [45.5155, -122.6789],
  'Philadelphia': [39.9526, -75.1652],
  'Washington DC': [38.9072, -77.0369],
  'Denver': [39.7392, -104.9903],
  'Phoenix': [33.4484, -112.0740],
  'San Diego': [32.7157, -117.1611],
  'Austin': [30.2672, -97.7431],
  'Nashville': [36.1627, -86.7816],
  'Minneapolis': [44.9778, -93.2650],
  'Cleveland': [41.4993, -81.6944],
  'Columbus': [39.9612, -82.9988],
  'Indianapolis': [39.7684, -86.1581],
  'St. Louis': [38.6270, -90.1994],
  'Kansas City': [39.0997, -94.5786],
  'Salt Lake City': [40.7608, -111.8910],
  'Las Vegas': [36.1699, -115.1398],
  'Orlando': [28.5383, -81.3792],
  'Charlotte': [35.2271, -80.8431],
  'Pittsburgh': [40.4406, -79.9959],
};

// Get coordinates for a city
export const getCityCoordinates = (cityName) => {
  // Try exact match first
  if (CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }
  
  // Try partial match
  const normalizedName = cityName.toLowerCase().trim();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (city.toLowerCase().includes(normalizedName) || normalizedName.includes(city.toLowerCase())) {
      return coords;
    }
  }
  
  // Return null if not found
  return null;
};

// Generate intermediate points between two coordinates
export const generateRoutePath = (start, end, numPoints = 10) => {
  if (!start || !end) return [];
  
  const path = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Add slight curve for more realistic route
    const curve = Math.sin(t * Math.PI) * 0.5;
    const lat = start[0] + (end[0] - start[0]) * t + curve * (Math.random() * 0.2 - 0.1);
    const lng = start[1] + (end[1] - start[1]) * t;
    path.push([lat, lng]);
  }
  return path;
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (point1, point2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (point2[0] - point1[0]) * Math.PI / 180;
  const dLon = (point2[1] - point1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate travel time based on distance (average 55 mph)
export const estimateTravelTime = (distanceMiles) => {
  const hours = distanceMiles / 55;
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

// Generate checkpoints along a route
export const generateCheckpoints = (routePath, numCheckpoints = 3) => {
  if (routePath.length < 3) return [];
  
  const checkpoints = [];
  const step = Math.floor(routePath.length / (numCheckpoints + 1));
  
  const checkpointNames = [
    'Distribution Center',
    'Regional Hub',
    'Transit Facility',
    'Sorting Center',
    'Local Terminal',
    'Delivery Hub',
  ];
  
  for (let i = 1; i <= numCheckpoints; i++) {
    const index = i * step;
    if (index < routePath.length) {
      checkpoints.push({
        id: `checkpoint-${i}`,
        name: checkpointNames[i - 1] || `Checkpoint ${i}`,
        coordinates: routePath[index],
        index,
        passed: false,
        timestamp: null,
      });
    }
  }
  
  return checkpoints;
};

// Simulate real-time tracking updates
export const simulateTrackingUpdate = (routePath, progress) => {
  if (!routePath.length) return null;
  
  const index = Math.floor(progress * (routePath.length - 1));
  return {
    position: routePath[Math.min(index, routePath.length - 1)],
    progress: Math.round(progress * 100),
    eta: estimateTravelTime((1 - progress) * calculateDistance(routePath[0], routePath[routePath.length - 1])),
    speed: Math.round(45 + Math.random() * 20), // 45-65 mph
    lastUpdate: new Date().toISOString(),
  };
};

// Get tracking status based on shipment status
export const getTrackingStatus = (shipmentStatus) => {
  const statusMap = {
    'Created': { progress: 0, status: 'pending', message: 'Awaiting pickup' },
    'Picked Up': { progress: 15, status: 'active', message: 'Package picked up' },
    'In Transit': { progress: 50, status: 'active', message: 'In transit to destination' },
    'Out for Delivery': { progress: 85, status: 'active', message: 'Out for delivery' },
    'Delivered': { progress: 100, status: 'completed', message: 'Delivered successfully' },
    'Cancelled': { progress: 0, status: 'cancelled', message: 'Shipment cancelled' },
  };
  
  return statusMap[shipmentStatus] || statusMap['Created'];
};

// Demo tracking data for shipments
export const DEMO_TRACKING_DATA = {
  'SHP-001': {
    progress: 65,
    currentLocation: 'Gary, IN',
    speed: 58,
    eta: '2h 15m',
    lastUpdate: '2026-01-15T08:30:00Z',
    events: [
      { time: '2026-01-11T09:00:00Z', event: 'Shipment created', location: 'Chicago, IL' },
      { time: '2026-01-11T10:30:00Z', event: 'Picked up from sender', location: 'Chicago, IL' },
      { time: '2026-01-11T11:00:00Z', event: 'Departed distribution center', location: 'Chicago, IL' },
      { time: '2026-01-11T14:30:00Z', event: 'In transit', location: 'Gary, IN' },
    ],
  },
  'SHP-003': {
    progress: 45,
    currentLocation: 'Hartford, CT',
    speed: 52,
    eta: '3h 45m',
    lastUpdate: '2026-01-15T08:45:00Z',
    events: [
      { time: '2026-01-09T08:30:00Z', event: 'Shipment created', location: 'New York, NY' },
      { time: '2026-01-10T07:00:00Z', event: 'Picked up from sender', location: 'New York, NY' },
      { time: '2026-01-10T08:00:00Z', event: 'Temperature check completed', location: 'New York, NY' },
      { time: '2026-01-10T14:00:00Z', event: 'In transit', location: 'Hartford, CT' },
    ],
  },
  'SHP-006': {
    progress: 25,
    currentLocation: 'Tacoma, WA',
    speed: 48,
    eta: '2h 30m',
    lastUpdate: '2026-01-15T07:15:00Z',
    events: [
      { time: '2026-01-11T07:45:00Z', event: 'Shipment created', location: 'Seattle, WA' },
      { time: '2026-01-12T09:15:00Z', event: 'Picked up from sender', location: 'Seattle, WA' },
      { time: '2026-01-12T10:00:00Z', event: 'Departed warehouse', location: 'Seattle, WA' },
    ],
  },
};
