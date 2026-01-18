import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useShipmentStore } from '../shipment.store';
import TrackingMap from './TrackingMap';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import { formatDateTime, formatDate } from '../../utils/formatters';
import {
  getCityCoordinates,
  generateRoutePath,
  generateCheckpoints,
  calculateDistance,
  estimateTravelTime,
  getTrackingStatus,
  DEMO_TRACKING_DATA,
} from './trackingData';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Package,
  Clock,
  RefreshCw,
  Navigation,
  Thermometer,
  Gauge,
  Route,
  CheckCircle,
  Circle,
  AlertTriangle,
  Share2,
  Bell,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  Target,
  Zap,
  TrendingUp,
  Activity,
  Map,
} from 'lucide-react';

/**
 * ShipmentTracking Component
 * Real-time shipment tracking with interactive map, live updates, and detailed journey info
 */
export default function ShipmentTracking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const {
    currentShipment,
    fetchShipmentById,
    searchShipmentByOrderId,
    isLoading,
    error,
    clearCurrentShipment,
  } = useShipmentStore();

  // Tracking state
  const [trackingData, setTrackingData] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    deliveryAlert: true,
    delayAlert: true,
  });

  // Load shipment data
  useEffect(() => {
    const loadShipment = async () => {
      if (id) {
        await fetchShipmentById(id);
      } else if (orderId) {
        await searchShipmentByOrderId(orderId);
      }
    };

    loadShipment();

    return () => clearCurrentShipment();
  }, [id, orderId, fetchShipmentById, searchShipmentByOrderId, clearCurrentShipment]);

  // Generate route and tracking data
  const routeData = useMemo(() => {
    if (!currentShipment) return null;

    const originCoords = getCityCoordinates(currentShipment.origin);
    const destCoords = getCityCoordinates(currentShipment.destination);

    if (!originCoords || !destCoords) return null;

    const routePath = generateRoutePath(originCoords, destCoords, 20);
    const checkpoints = generateCheckpoints(routePath, 3);
    const distance = calculateDistance(originCoords, destCoords);
    const travelTime = estimateTravelTime(distance);

    return {
      origin: {
        name: currentShipment.origin,
        address: currentShipment.originAddress,
        coordinates: originCoords,
      },
      destination: {
        name: currentShipment.destination,
        address: currentShipment.destinationAddress,
        coordinates: destCoords,
      },
      routePath,
      checkpoints,
      distance: Math.round(distance),
      estimatedTime: travelTime,
    };
  }, [currentShipment]);

  // Get demo tracking data or generate based on status
  useEffect(() => {
    if (!currentShipment || !routeData) return;

    const demoData = DEMO_TRACKING_DATA[currentShipment.id];
    const statusInfo = getTrackingStatus(currentShipment.status);

    if (demoData) {
      setTrackingData({
        ...demoData,
        statusInfo,
      });

      // Set current position based on progress
      if (routeData.routePath.length && demoData.progress > 0) {
        const index = Math.floor((demoData.progress / 100) * (routeData.routePath.length - 1));
        setCurrentPosition(routeData.routePath[index]);
      }
    } else {
      // Generate tracking data based on status
      setTrackingData({
        progress: statusInfo.progress,
        currentLocation: currentShipment.origin,
        speed: 0,
        eta: routeData.estimatedTime,
        lastUpdate: new Date().toISOString(),
        statusInfo,
        events: [],
      });

      if (statusInfo.progress > 0 && routeData.routePath.length) {
        const index = Math.floor((statusInfo.progress / 100) * (routeData.routePath.length - 1));
        setCurrentPosition(routeData.routePath[index]);
      }
    }
  }, [currentShipment, routeData]);

  // Simulate live tracking updates
  useEffect(() => {
    if (!isLiveTracking || !routeData?.routePath.length || !trackingData) return;

    const interval = setInterval(() => {
      setTrackingData((prev) => {
        if (!prev || prev.progress >= 100) return prev;

        const newProgress = Math.min(prev.progress + Math.random() * 2, 100);
        const index = Math.floor((newProgress / 100) * (routeData.routePath.length - 1));

        setCurrentPosition(routeData.routePath[index]);
        setLastRefresh(new Date());

        return {
          ...prev,
          progress: newProgress,
          speed: Math.round(45 + Math.random() * 20),
          lastUpdate: new Date().toISOString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTracking, routeData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || isLiveTracking) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, isLiveTracking]);

  // Update checkpoints based on progress
  const updatedCheckpoints = useMemo(() => {
    if (!routeData?.checkpoints || !trackingData) return [];

    const progressIndex = Math.floor((trackingData.progress / 100) * (routeData.routePath?.length - 1 || 0));

    return routeData.checkpoints.map((cp) => ({
      ...cp,
      passed: cp.index <= progressIndex,
      timestamp: cp.index <= progressIndex 
        ? formatDateTime(new Date(Date.now() - (progressIndex - cp.index) * 3600000))
        : null,
    }));
  }, [routeData, trackingData]);

  // Copy tracking link
  const copyTrackingLink = useCallback(() => {
    const link = `${window.location.origin}/tracking/${currentShipment?.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentShipment]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    // In real app, this would refetch tracking data from API
  }, []);

  // Search state for when no ID is provided
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setSearchError('Please enter a tracking or order ID');
      return;
    }
    setSearchError('');
    
    // Try to find the shipment
    if (searchInput.startsWith('SHP-')) {
      await fetchShipmentById(searchInput.trim());
    } else {
      await searchShipmentByOrderId(searchInput.trim());
    }
  };

  if (isLoading) {
    return <Loader text="Loading tracking information..." />;
  }

  // Show search form when no ID is provided and no shipment loaded
  if (!id && !orderId && !currentShipment) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
          <p className="text-gray-600">Enter your tracking number or order ID to get real-time updates</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tracking Number or Order ID
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value.toUpperCase());
                    setSearchError('');
                  }}
                  placeholder="e.g., ORD-2026-001 or SHP-001"
                  className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {searchError && (
                <p className="mt-2 text-sm text-red-600">{searchError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Navigation size={20} />
              Track Shipment
            </button>
          </div>

          {/* Demo IDs */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Try these demo tracking IDs:</p>
            <div className="flex flex-wrap gap-2">
              {['ORD-2026-001', 'ORD-2026-003', 'SHP-001', 'SHP-003'].map((demoId) => (
                <button
                  key={demoId}
                  type="button"
                  onClick={() => setSearchInput(demoId)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-mono rounded-lg transition-colors"
                >
                  {demoId}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Live Location</p>
            <p className="text-xs text-gray-500">Real-time tracking</p>
          </div>
          <div className="p-4">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Accurate ETA</p>
            <p className="text-xs text-gray-500">Delivery estimates</p>
          </div>
          <div className="p-4">
            <Bell className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Alerts</p>
            <p className="text-xs text-gray-500">Status notifications</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentShipment) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipment Not Found</h2>
        <p className="text-gray-500 mb-6">
          {error || "We couldn't find the shipment you're looking for."}
        </p>
        <Link
          to="/shipments"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/shipments/${currentShipment.id}`}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Track Shipment
              </h1>
              <StatusBadge status={currentShipment.status} />
            </div>
            <p className="text-gray-600 mt-1 font-mono">
              {currentShipment.orderId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Live tracking toggle */}
          <button
            onClick={() => setIsLiveTracking(!isLiveTracking)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isLiveTracking
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLiveTracking ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Live
              </>
            ) : (
              <>
                <Activity size={18} />
                Start Live
              </>
            )}
          </button>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} className={autoRefresh ? 'animate-spin-slow' : ''} />
            Refresh
          </button>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={18} />
            Share
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Bell size={18} />
            Alerts
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp size={16} />
            Progress
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(trackingData?.progress || 0)}%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Clock size={16} />
            ETA
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {trackingData?.eta || routeData?.estimatedTime || '--'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Route size={16} />
            Distance
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {routeData?.distance || '--'} mi
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Gauge size={16} />
            Speed
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {trackingData?.speed || 0} mph
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <MapPin size={16} />
            Location
          </div>
          <p className="text-lg font-semibold text-gray-900 truncate">
            {trackingData?.currentLocation || currentShipment.origin}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <RefreshCw size={16} />
            Updated
          </div>
          <p className="text-sm font-medium text-gray-900">
            {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="text-primary-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Live Tracking Map</h2>
              </div>
              {isLiveTracking && (
                <span className="flex items-center gap-2 text-sm text-red-600 font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Tracking Active
                </span>
              )}
            </div>

            {routeData ? (
              <TrackingMap
                origin={routeData.origin}
                destination={routeData.destination}
                currentPosition={currentPosition}
                routePath={routeData.routePath}
                checkpoints={updatedCheckpoints}
                isLive={isLiveTracking}
                height="450px"
              />
            ) : (
              <div className="h-[450px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-gray-600">Unable to load map for this route</p>
                  <p className="text-sm text-gray-500 mt-1">
                    City coordinates not available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Progress</h3>
            
            <div className="relative">
              {/* Progress track */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-green-500 transition-all duration-500 relative"
                  style={{ width: `${trackingData?.progress || 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              {/* Milestone markers */}
              <div className="flex justify-between mt-4">
                {[
                  { label: 'Picked Up', percent: 0, icon: Package },
                  { label: 'In Transit', percent: 50, icon: Truck },
                  { label: 'Delivered', percent: 100, icon: CheckCircle },
                ].map((milestone, idx) => {
                  const isCompleted = (trackingData?.progress || 0) >= milestone.percent;
                  const Icon = milestone.icon;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {milestone.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Journey Updates</h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-6">
                {/* Origin */}
                <div className="relative flex gap-4">
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Origin - {currentShipment.origin}</p>
                        <p className="text-sm text-gray-500">{currentShipment.originAddress}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Departed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkpoints */}
                {updatedCheckpoints.map((checkpoint, idx) => (
                  <div key={checkpoint.id} className="relative flex gap-4">
                    <div
                      className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                        checkpoint.passed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {checkpoint.passed ? <CheckCircle size={16} /> : <Circle size={16} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-semibold ${checkpoint.passed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {checkpoint.name}
                          </p>
                          {checkpoint.timestamp && (
                            <p className="text-sm text-gray-500">{checkpoint.timestamp}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          checkpoint.passed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {checkpoint.passed ? 'Passed' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current Location (if in transit) */}
                {trackingData?.progress > 0 && trackingData?.progress < 100 && (
                  <div className="relative flex gap-4">
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white animate-pulse">
                      <Truck size={16} />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-blue-600">Current Location</p>
                          <p className="text-sm text-gray-500">
                            {trackingData?.currentLocation || 'In transit...'}
                          </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse">
                          Now
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Destination */}
                <div className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      trackingData?.progress >= 100
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Target size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-semibold ${
                          trackingData?.progress >= 100 ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Destination - {currentShipment.destination}
                        </p>
                        <p className="text-sm text-gray-500">{currentShipment.destinationAddress}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        trackingData?.progress >= 100
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {trackingData?.progress >= 100 ? 'Delivered' : `ETA: ${trackingData?.eta || routeData?.estimatedTime}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Shipment Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium text-gray-900">{currentShipment.orderId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={currentShipment.status} />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Priority</span>
                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                  currentShipment.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  currentShipment.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentShipment.priority}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium text-gray-900">{currentShipment.weight} kg</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium text-gray-900">{currentShipment.quantity} items</span>
              </div>
            </div>

            <Link
              to={`/shipments/${currentShipment.id}`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={18} />
              View Full Details
            </Link>
          </div>

          {/* Sender Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sender</h3>
            
            <div className="space-y-3">
              <p className="font-medium text-gray-900">{currentShipment.senderName}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{currentShipment.senderPhone}</span>
              </div>
              {currentShipment.senderEmail && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{currentShipment.senderEmail}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span>{currentShipment.originAddress}</span>
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Receiver</h3>
            
            <div className="space-y-3">
              <p className="font-medium text-gray-900">{currentShipment.receiverName}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{currentShipment.receiverPhone}</span>
              </div>
              {currentShipment.receiverEmail && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{currentShipment.receiverEmail}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span>{currentShipment.destinationAddress}</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} />
              <h3 className="font-semibold">Estimated Delivery</h3>
            </div>
            
            <p className="text-3xl font-bold mb-2">
              {currentShipment.estimatedDelivery 
                ? formatDate(currentShipment.estimatedDelivery)
                : 'Calculating...'}
            </p>
            
            {trackingData?.eta && (
              <div className="flex items-center gap-2 text-primary-100">
                <Clock size={16} />
                <span>ETA: {trackingData.eta}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <button
                onClick={copyTrackingLink}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy Tracking Link'}
              </button>
              
              <button
                onClick={() => setShowNotificationModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Bell size={18} />
                Set Up Alerts
              </button>
              
              <a
                href={`tel:${currentShipment.receiverPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone size={18} />
                Call Receiver
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Tracking</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tracking Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/tracking/${currentShipment.id}`}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={copyTrackingLink}
                    className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Mail size={18} />
                  Email
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Phone size={18} />
                  SMS
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, email: !n.email }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, sms: !n.sms }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.sms ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Delivery Alert</p>
                  <p className="text-sm text-gray-500">Notify when delivered</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, deliveryAlert: !n.deliveryAlert }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.deliveryAlert ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.deliveryAlert ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Delay Alert</p>
                  <p className="text-sm text-gray-500">Notify if delayed</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, delayAlert: !n.delayAlert }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.delayAlert ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.delayAlert ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
