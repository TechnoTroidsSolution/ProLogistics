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
  TrendingUp,
  ArrowRight,
  Activity,
  AlertCircle,
  RefreshCw,
  Clock,
  Calendar,
  MapPin,
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Displays overview statistics and quick operational summary
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [statsData, activityData, scheduleData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(10),
        dashboardApi.getTodaySchedule(),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setTodaySchedule(scheduleData);
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
      trend: '+8.3%',
      trendUp: true,
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
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'In Transit',
      value: displayStats.inTransitShipments,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtitle: 'In Transit',
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
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
      case 'in-transit':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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

      {/* Stats Grid with Mini Charts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                )}
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trendUp ? (
                      <TrendingUp className="text-green-500" size={12} />
                    ) : (
                      <TrendingUp className="text-red-500 rotate-180" size={12} />
                    )}
                    <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.textColor} size={18} />
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="h-8 flex items-end gap-0.5">
              {[65, 72, 68, 75, 80, 78, 85, 90, 88, 92, 95, 100].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 ${stat.color} rounded-t opacity-60`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Activity Timeline */}
      {todaySchedule && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-blue-600" size={18} />
            <h2 className="font-semibold text-gray-900">Today's Activity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickups Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Scheduled Pickups</h3>
              <div className="space-y-2">
                {todaySchedule.pickups?.slice(0, 4).map((pickup) => (
                  <div key={pickup.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(pickup.status)}`}>
                      {pickup.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{pickup.customer}</p>
                      <p className="text-xs text-gray-500 truncate">{pickup.location}</p>
                    </div>
                    <MapPin className="text-gray-400 flex-shrink-0" size={14} />
                  </div>
                ))}
              </div>
            </div>

            {/* Deliveries Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Expected Deliveries</h3>
              <div className="space-y-2">
                {todaySchedule.deliveries?.slice(0, 4).map((delivery) => (
                  <div key={delivery.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                      {delivery.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{delivery.customer}</p>
                      <p className="text-xs text-gray-500 truncate">{delivery.location}</p>
                    </div>
                    <CheckCircle className="text-gray-400 flex-shrink-0" size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
