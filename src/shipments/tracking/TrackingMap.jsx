import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (color, type = 'circle') => {
  const svgIcons = {
    origin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>`,
    destination: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>`,
    vehicle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40" height="40">
      <rect x="2" y="8" width="20" height="10" rx="2" fill="${color}" stroke="white" stroke-width="1"/>
      <circle cx="7" cy="18" r="2" fill="#333" stroke="white"/>
      <circle cx="17" cy="18" r="2" fill="#333" stroke="white"/>
      <rect x="14" y="10" width="6" height="4" fill="#87CEEB" rx="1"/>
    </svg>`,
    checkpoint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>`,
  };

  return L.divIcon({
    html: svgIcons[type] || svgIcons.circle,
    className: 'custom-marker',
    iconSize: type === 'vehicle' ? [40, 40] : [32, 32],
    iconAnchor: type === 'vehicle' ? [20, 20] : [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to fit map bounds
function FitBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  
  return null;
}

// Component to animate vehicle movement
function AnimatedVehicle({ position, rotation = 0 }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.panTo(position, { animate: true, duration: 0.5 });
    }
  }, [map, position]);
  
  return null;
}

/**
 * TrackingMap Component
 * Displays an interactive map with shipment route, checkpoints, and real-time vehicle position
 */
export default function TrackingMap({ 
  origin,
  destination,
  currentPosition,
  routePath = [],
  checkpoints = [],
  isLive = false,
  showRoute = true,
  height = '400px',
}) {
  const mapRef = useRef(null);

  // Calculate bounds to fit all markers
  const bounds = useMemo(() => {
    const points = [];
    if (origin?.coordinates) points.push(origin.coordinates);
    if (destination?.coordinates) points.push(destination.coordinates);
    if (currentPosition) points.push(currentPosition);
    checkpoints.forEach(cp => {
      if (cp.coordinates) points.push(cp.coordinates);
    });
    return points.length >= 2 ? points : null;
  }, [origin, destination, currentPosition, checkpoints]);

  // Default center (US)
  const defaultCenter = [39.8283, -98.5795];
  const center = currentPosition || origin?.coordinates || defaultCenter;

  // Route line styling
  const routeOptions = {
    color: '#3B82F6',
    weight: 4,
    opacity: 0.8,
    dashArray: showRoute ? null : '10, 10',
  };

  const completedRouteOptions = {
    color: '#10B981',
    weight: 5,
    opacity: 1,
  };

  // Split route into completed and remaining
  const completedPath = useMemo(() => {
    if (!routePath.length || !currentPosition) return [];
    const currentIndex = routePath.findIndex(
      point => point[0] === currentPosition[0] && point[1] === currentPosition[1]
    );
    return currentIndex > 0 ? routePath.slice(0, currentIndex + 1) : [];
  }, [routePath, currentPosition]);

  const remainingPath = useMemo(() => {
    if (!routePath.length || !currentPosition) return routePath;
    const currentIndex = routePath.findIndex(
      point => point[0] === currentPosition[0] && point[1] === currentPosition[1]
    );
    return currentIndex >= 0 ? routePath.slice(currentIndex) : routePath;
  }, [routePath, currentPosition]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE TRACKING
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={center}
        zoom={6}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
      >
        {/* Map tiles - OpenStreetMap (free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Alternative: CartoDB Voyager (cleaner look) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        /> */}

        {/* Fit bounds to show all markers */}
        {bounds && <FitBounds bounds={bounds} />}

        {/* Completed route (green) */}
        {completedPath.length > 1 && (
          <Polyline positions={completedPath} pathOptions={completedRouteOptions} />
        )}

        {/* Remaining route (blue dashed) */}
        {remainingPath.length > 1 && (
          <Polyline 
            positions={remainingPath} 
            pathOptions={{ ...routeOptions, dashArray: '10, 10' }} 
          />
        )}

        {/* Full route (if no current position) */}
        {!currentPosition && routePath.length > 1 && (
          <Polyline positions={routePath} pathOptions={routeOptions} />
        )}

        {/* Origin marker */}
        {origin?.coordinates && (
          <Marker 
            position={origin.coordinates} 
            icon={createCustomIcon('#10B981', 'origin')}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-green-600">Origin</p>
                <p className="text-sm">{origin.name}</p>
                {origin.address && (
                  <p className="text-xs text-gray-500 mt-1">{origin.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination?.coordinates && (
          <Marker 
            position={destination.coordinates} 
            icon={createCustomIcon('#EF4444', 'destination')}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-red-600">Destination</p>
                <p className="text-sm">{destination.name}</p>
                {destination.address && (
                  <p className="text-xs text-gray-500 mt-1">{destination.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Checkpoint markers */}
        {checkpoints.map((checkpoint, index) => (
          <Marker
            key={checkpoint.id || index}
            position={checkpoint.coordinates}
            icon={createCustomIcon(
              checkpoint.passed ? '#10B981' : '#94A3B8', 
              'checkpoint'
            )}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{checkpoint.name}</p>
                <p className="text-xs text-gray-500">{checkpoint.timestamp}</p>
                {checkpoint.status && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    checkpoint.passed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {checkpoint.passed ? 'Passed' : 'Upcoming'}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Current vehicle position */}
        {currentPosition && (
          <>
            <AnimatedVehicle position={currentPosition} />
            <Marker 
              position={currentPosition} 
              icon={createCustomIcon('#3B82F6', 'vehicle')}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">Current Location</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2 text-gray-700">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500 rounded" />
            <span>Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-500 border-dashed border-t-2 border-blue-500" style={{ borderStyle: 'dashed' }} />
            <span>Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}
