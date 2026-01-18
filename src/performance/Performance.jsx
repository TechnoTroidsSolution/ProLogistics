import { useState, useEffect } from 'react';
import { PERFORMANCE_DATA } from '../data/performance-data';
import Loader from '../components/Loader';
import {
    TrendingUp,
    TrendingDown,
    Truck,
    Package,
    Clock,
    DollarSign,
    Target,
    BarChart3,
    RefreshCw,
    CheckCircle,
    Star,
} from 'lucide-react';

export default function Performance() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30days');

    useEffect(() => {
        setTimeout(() => {
            setData(PERFORMANCE_DATA);
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) return <Loader text="Loading performance data..." />;
    if (!data) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">No performance data available</p></div>;

    const { carrierPerformance, deliveryMetrics, costAnalysis, routePerformance, summary } = data;
    const maxShipments = Math.max(...carrierPerformance.map(c => c.totalShipments));

    const getPerformanceColor = (rate) => {
        if (rate >= 95) return 'bg-green-500';
        if (rate >= 90) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getPerformanceTextColor = (rate) => {
        if (rate >= 95) return 'text-green-600';
        if (rate >= 90) return 'text-amber-600';
        return 'text-red-600';
    };

    const totalShipments = carrierPerformance.reduce((sum, c) => sum + c.totalShipments, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">KPIs and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                    </select>
                    <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <RefreshCw size={16} />Refresh
                    </button>
                </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><Package className="text-blue-600" size={18} /><p className="text-xs font-medium text-gray-500">Total Shipments</p></div>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalShipments}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="text-green-600" size={18} /><p className="text-xs font-medium text-gray-500">On-Time Rate</p></div>
                    <p className="text-2xl font-bold text-green-600">{summary.avgOnTimeRate}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><Clock className="text-amber-600" size={18} /><p className="text-xs font-medium text-gray-500">Avg Transit</p></div>
                    <p className="text-2xl font-bold text-gray-900">{summary.avgTransitTime}d</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><DollarSign className="text-purple-600" size={18} /><p className="text-xs font-medium text-gray-500">Avg Cost</p></div>
                    <p className="text-2xl font-bold text-gray-900">${summary.avgCost}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><Star className="text-yellow-600" size={18} /><p className="text-xs font-medium text-gray-500">Satisfaction</p></div>
                    <p className="text-2xl font-bold text-gray-900">{summary.customerSatisfaction}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2"><Target className="text-indigo-600" size={18} /><p className="text-xs font-medium text-gray-500">Efficiency</p></div>
                    <p className="text-2xl font-bold text-gray-900">{summary.efficiency}%</p>
                </div>
            </div>

            {/* Carrier Performance - Mixed Chart Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* On-Time Performance - Horizontal Bars */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">On-Time Performance</h2>
                        <CheckCircle className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {carrierPerformance.map((carrier) => (
                            <div key={carrier.id} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">{carrier.name}</span>
                                    <span className={`font-bold ${getPerformanceTextColor(carrier.onTimeRate)}`}>{carrier.onTimeRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${getPerformanceColor(carrier.onTimeRate)}`} style={{ width: `${carrier.onTimeRate}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipment Volume - Pie Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Volume Distribution</h2>
                        <Package className="text-gray-400" size={20} />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-48 h-48">
                            <div className="absolute inset-0 rounded-full" style={{
                                background: `conic-gradient(
                  #8b5cf6 0% ${(carrierPerformance[0].totalShipments / totalShipments) * 100}%,
                  #c7d2fe ${(carrierPerformance[0].totalShipments / totalShipments) * 100}% ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments) / totalShipments) * 100}%,
                  #a7f3d0 ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments) / totalShipments) * 100}% ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments + carrierPerformance[2].totalShipments) / totalShipments) * 100}%,
                  #fde68a ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments + carrierPerformance[2].totalShipments) / totalShipments) * 100}% ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments + carrierPerformance[2].totalShipments + carrierPerformance[3].totalShipments) / totalShipments) * 100}%,
                  #bfdbfe ${((carrierPerformance[0].totalShipments + carrierPerformance[1].totalShipments + carrierPerformance[2].totalShipments + carrierPerformance[3].totalShipments) / totalShipments) * 100}% 100%
                )`
                            }}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {carrierPerformance.map((carrier, index) => {
                            const colors = ['bg-[#8b5cf6]',
                                'bg-[#c088f9]',
                                'bg-[#fde68a]',
                                'bg-[#a7f3d0]',
                                'bg-[#bfdbfe]',];
                            const pct = ((carrier.totalShipments / totalShipments) * 100).toFixed(1);
                            return (
                                <div key={carrier.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                                        <span className="text-sm font-medium text-gray-700">{carrier.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{carrier.totalShipments} ({pct}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Average Cost - Donut Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Cost Distribution</h2>
                        <DollarSign className="text-gray-400" size={20} />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full" style={{
                                background: `conic-gradient(#8b5cf6 0% 20%, #c088f9ff 20% 45%, #fde68a 45% 75%, #a7f3d0 75% 90%, #bfdbfe 90% 100%)`
                            }}>
                                <div className="absolute inset-5 bg-white rounded-full flex items-center justify-center flex-col">
                                    <p className="text-xl font-bold text-gray-900">${costAnalysis.perShipment}</p>
                                    <p className="text-xs text-gray-500">Avg</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {carrierPerformance.map((carrier, index) => {
                            const colors = ['bg-[#8b5cf6]',
                                'bg-[#c088f9]',
                                'bg-[#fde68a]',
                                'bg-[#a7f3d0]',
                                'bg-[#bfdbfe]',];
                            return (
                                <div key={carrier.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                                        <span className="font-medium text-gray-700">{carrier.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">${carrier.avgCost}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Carrier Ratings - Stacked Bars */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Carrier Ratings</h2>
                        <Star className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {carrierPerformance.map((carrier) => {
                            const filled = Math.floor(carrier.rating);
                            const partial = carrier.rating - filled;
                            return (
                                <div key={carrier.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">{carrier.name}</span>
                                        <span className="font-bold text-gray-900">{carrier.rating}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                                                <div className={`h-full ${i < filled ? 'bg-yellow-500' : i === filled && partial > 0 ? 'bg-yellow-500' : 'bg-gray-200'}`} style={{ width: i === filled ? `${partial * 100}%` : i < filled ? '100%' : '0%' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delivery Performance Donut */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h2>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 rounded-full" style={{
                            background: `conic-gradient(
                #a7f3d0 0% ${(deliveryMetrics.onTime / deliveryMetrics.total) * 100}%,
                #fde68a ${(deliveryMetrics.onTime / deliveryMetrics.total) * 100}% ${((deliveryMetrics.onTime + deliveryMetrics.delayed) / deliveryMetrics.total) * 100}%,
                #bfdbfe ${((deliveryMetrics.onTime + deliveryMetrics.delayed) / deliveryMetrics.total) * 100}% 100%
              )`
                        }}>
                            <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center flex-col">
                                <p className="text-3xl font-bold text-gray-900">{deliveryMetrics.rate}%</p>
                                <p className="text-xs text-gray-500">On-Time</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">On Time</span></div>
                        <span className="text-sm font-bold text-gray-900">{deliveryMetrics.onTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Delayed</span></div>
                        <span className="text-sm font-bold text-gray-900">{deliveryMetrics.delayed}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Early</span></div>
                        <span className="text-sm font-bold text-gray-900">{deliveryMetrics.early}</span>
                    </div>
                </div>
            </div>

            {/* Cost & Route Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Cost Analysis</h2>
                        <DollarSign className="text-gray-400" size={20} />
                    </div>
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Average Cost per Shipment</p>
                                <p className="text-3xl font-bold text-gray-900">${costAnalysis.perShipment}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {costAnalysis.trend < 0 ? (<><TrendingDown className="text-green-500" size={20} /><span className="text-sm font-semibold text-green-600">{Math.abs(costAnalysis.trend)}%</span></>) : (<><TrendingUp className="text-red-500" size={20} /><span className="text-sm font-semibold text-red-600">{costAnalysis.trend}%</span></>)}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">Cost by Carrier</h3>
                        {costAnalysis.byCarrier.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">{item.carrier}</span>
                                    <span className="font-semibold text-gray-900">${item.cost}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Route Performance</h2>
                        <BarChart3 className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {routePerformance.map((route) => (
                            <div key={route.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 text-sm">{route.route}</span>
                                    <span className={`text-xs font-semibold ${getPerformanceTextColor(route.efficiency)}`}>{route.efficiency}%</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                                    <div><p className="text-gray-500">Volume</p><p className="font-semibold text-gray-900">{route.volume}</p></div>
                                    <div><p className="text-gray-500">Revenue</p><p className="font-semibold text-gray-900">${(route.revenue / 1000).toFixed(0)}K</p></div>
                                    <div><p className="text-gray-500">On-Time</p><p className="font-semibold text-gray-900">{route.onTimeRate}%</p></div>
                                    <div><p className="text-gray-500">Avg Cost</p><p className="font-semibold text-gray-900">${route.avgCost}</p></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                    <div className={`h-full rounded-full ${getPerformanceColor(route.efficiency)}`} style={{ width: `${route.efficiency}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
