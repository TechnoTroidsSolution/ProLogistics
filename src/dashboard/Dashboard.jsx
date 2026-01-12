import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { formatDateTime } from '../utils/formatters';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Activity,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Displays overview statistics and recent activity
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsData, activityData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(10),
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  // Fallback stats for demo
  const displayStats = stats || {
    totalShipments: 156,
    activeShipments: 42,
    deliveredShipments: 98,
    createdShipments: 16,
    inTransitShipments: 26,
  };

  const statsCards = [
    {
      title: 'Total Shipments',
      value: displayStats.totalShipments,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Shipments',
      value: displayStats.activeShipments,
      icon: Truck,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      subtitle: 'In Transit + Created',
    },
    {
      title: 'Delivered',
      value: displayStats.deliveredShipments,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'In Transit',
      value: displayStats.inTransitShipments,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  // Demo recent activity
  const displayActivity = recentActivity.length > 0 ? recentActivity : [
    {
      id: '1',
      type: 'status_update',
      shipmentId: 'SHP-2026-001',
      orderId: 'ORD-2026-001',
      status: 'In Transit',
      message: 'Shipment picked up from warehouse',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'created',
      shipmentId: 'SHP-2026-002',
      orderId: 'ORD-2026-002',
      status: 'Created',
      message: 'New shipment created',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'delivered',
      shipmentId: 'SHP-2026-003',
      orderId: 'ORD-2025-098',
      status: 'Delivered',
      message: 'Package delivered successfully',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'vehicle_assigned',
      shipmentId: 'SHP-2026-004',
      orderId: 'ORD-2026-003',
      status: 'Created',
      message: 'Vehicle TRK-456 assigned',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: '5',
      type: 'status_update',
      shipmentId: 'SHP-2026-005',
      orderId: 'ORD-2025-097',
      status: 'In Transit',
      message: 'Shipment departed from hub',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.textColor} size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/shipments/create"
              className="flex items-center justify-between p-2.5 bg-primary-50 rounded-lg hover:bg-primary-100 group"
            >
              <div className="flex items-center gap-2">
                <Package className="text-primary-600" size={16} />
                <span className="text-sm font-medium text-primary-700">Create Shipment</span>
              </div>
              <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
            
            <Link
              to="/shipments"
              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 group"
            >
              <div className="flex items-center gap-2">
                <Clock className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">View All Shipments</span>
              </div>
              <ArrowRight className="text-gray-600 group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
            
            <Link
              to="/carriers/vehicles"
              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 group"
            >
              <div className="flex items-center gap-2">
                <Truck className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Manage Vehicles</span>
              </div>
              <ArrowRight className="text-gray-600 group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link
              to="/shipments"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {displayActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="p-1.5 bg-gray-100 rounded">
                  <Activity className="text-gray-600" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/shipments/${activity.shipmentId}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {activity.orderId}
                    </Link>
                    <StatusBadge status={activity.status} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500">{activity.message}</p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Shipment Status Overview</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-600">Created</span>
              <span className="text-sm font-bold text-gray-900">{displayStats.createdShipments}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-500 rounded-full"
                style={{ width: `${(displayStats.createdShipments / displayStats.totalShipments) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-amber-700">In Transit</span>
              <span className="text-sm font-bold text-amber-900">{displayStats.inTransitShipments}</span>
            </div>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(displayStats.inTransitShipments / displayStats.totalShipments) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-green-700">Delivered</span>
              <span className="text-sm font-bold text-green-900">{displayStats.deliveredShipments}</span>
            </div>
            <div className="h-1.5 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(displayStats.deliveredShipments / displayStats.totalShipments) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
