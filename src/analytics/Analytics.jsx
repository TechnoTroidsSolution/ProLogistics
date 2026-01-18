import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/analytics.api';
import Loader from '../components/Loader';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    Clock,
    CheckCircle,
    Truck,
    MapPin,
    BarChart3,
    AlertCircle,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Star,
    Users,
    Activity,
} from 'lucide-react';


export default function Analytics() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalyticsData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const analyticsData = await analyticsApi.getAnalyticsOverview();
            setData(analyticsData);
        } catch (err) {
            setError(err.message || 'Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <Loader text="Loading analytics..." />;
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No analytics data available</p>
            </div>
        );
    }

    const { overview, shipmentTrends, statusDistribution, carrierPerformance, topRoutes, revenueByMonth, insights, performanceMetrics } = data;

    // Calculate max value for trend chart scaling
    const maxShipments = Math.max(...shipmentTrends.map(d => d.count));

    // Get last 7 days for mini chart
    const recentTrends = shipmentTrends.slice(-7);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Comprehensive insights and performance metrics</p>
                </div>
                <button
                    onClick={fetchAnalyticsData}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                ${overview.totalRevenue.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                {overview.revenueChange >= 0 ? (
                                    <ArrowUpRight className="text-green-500" size={16} />
                                ) : (
                                    <ArrowDownRight className="text-red-500" size={16} />
                                )}
                                <span className={`text-sm font-medium ${overview.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(overview.revenueChange)}%
                                </span>
                                <span className="text-xs text-gray-500">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Shipments This Month */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Shipments This Month</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {overview.shipmentsThisMonth}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                {overview.shipmentsChange >= 0 ? (
                                    <ArrowUpRight className="text-green-500" size={16} />
                                ) : (
                                    <ArrowDownRight className="text-red-500" size={16} />
                                )}
                                <span className={`text-sm font-medium ${overview.shipmentsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(overview.shipmentsChange)}%
                                </span>
                                <span className="text-xs text-gray-500">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Package className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* On-Time Delivery Rate */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">On-Time Delivery</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {overview.onTimeDeliveryRate}%
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                {overview.deliveryChange >= 0 ? (
                                    <ArrowUpRight className="text-green-500" size={16} />
                                ) : (
                                    <ArrowDownRight className="text-red-500" size={16} />
                                )}
                                <span className={`text-sm font-medium ${overview.deliveryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(overview.deliveryChange)}%
                                </span>
                                <span className="text-xs text-gray-500">improvement</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <CheckCircle className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Average Transit Time */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Avg Transit Time</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {overview.avgTransitTime} days
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                {overview.transitChange <= 0 ? (
                                    <ArrowDownRight className="text-green-500" size={16} />
                                ) : (
                                    <ArrowUpRight className="text-red-500" size={16} />
                                )}
                                <span className={`text-sm font-medium ${overview.transitChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(overview.transitChange)}
                                </span>
                                <span className="text-xs text-gray-500">days faster</span>
                            </div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Shipment Trends Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Shipment Trends (Last 30 Days)</h2>
                        <BarChart3 className="text-gray-400" size={20} />
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="space-y-1">
                        <div className="flex items-end justify-between gap-1 h-48">
                            {recentTrends.map((trend, index) => {
                                // Calculate height with minimum of 10% to ensure visibility
                                const calculatedHeight = (trend.count / maxShipments) * 100;
                                const height = Math.max(calculatedHeight, 10);
                                const date = new Date(trend.date);
                                const day = date.toLocaleDateString('en-US', { weekday: 'short' });

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group min-h-[8px]"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {trend.count} shipments
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{day}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-xs text-gray-600">Delivered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded"></div>
                                <span className="text-xs text-gray-600">In Transit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                                <span className="text-xs text-gray-600">Created</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>

                    <div className="space-y-4">
                        {statusDistribution.map((status) => (
                            <div key={status.status}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{status.status}</span>
                                    <span className="text-sm font-bold text-gray-900">{status.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${status.color === 'green' ? 'bg-green-500' :
                                            status.color === 'amber' ? 'bg-amber-500' :
                                                'bg-gray-500'
                                            }`}
                                        style={{ width: `${status.percentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{status.percentage}% of total</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Revenue Trends (Last 6 Months)</h2>
                    <DollarSign className="text-gray-400" size={20} />
                </div>

                <div className="space-y-1">
                    <div className="flex items-end justify-between gap-2 h-48">
                        {revenueByMonth.slice(-6).map((month, index) => {
                            const maxRevenue = Math.max(...revenueByMonth.slice(-6).map(m => m.revenue));
                            const height = (month.revenue / maxRevenue) * 100;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                                        <div
                                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all cursor-pointer relative group min-h-[8px]"
                                            style={{ height: `${Math.max(height, 10)}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                ${month.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{month.month}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Revenue (6 months)</span>
                            <span className="font-bold text-gray-900">
                                ${revenueByMonth.slice(-6).reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Shipment Volume */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Monthly Shipment Volume
                    </h2>
                    <Activity className="text-gray-400" size={20} />
                </div>

                <div className="space-y-4">
                    {revenueByMonth.slice(-6).map((month, index, arr) => {
                        const maxShipments = Math.max(...arr.map(m => m.shipments));
                        const percentage = (month.shipments / maxShipments) * 100;

                        const prev = index > 0 ? arr[index - 1].shipments : month.shipments;
                        const change = month.shipments - prev;
                        const isUp = change >= 0;

                        return (
                            <div key={month.month} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{month.month}</span>

                                    <div className="flex items-center gap-2">
                                        {index !== 0 && (
                                            <span
                                                className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {Math.abs(change)}
                                            </span>
                                        )}
                                        <span className="font-bold text-gray-900">
                                            {month.shipments}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Routes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Top Routes</h2>
                    <MapPin className="text-gray-400" size={20} />
                </div>

                <div className="space-y-3">
                    {topRoutes.map((route, index) => (
                        <div key={route.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900 truncate">{route.origin}</span>
                                        <ArrowUpRight className="text-gray-400 flex-shrink-0" size={14} />
                                        <span className="text-sm font-medium text-gray-900 truncate">{route.destination}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <p className="text-gray-500">Shipments</p>
                                            <p className="font-semibold text-gray-900">{route.shipments}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Revenue</p>
                                            <p className="font-semibold text-gray-900">${route.revenue.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Transit</p>
                                            <p className="font-semibold text-gray-900">{route.avgTransitTime}d</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

