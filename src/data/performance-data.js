/**
 * Performance Data
 * Centralized data source for performance metrics and KPIs
 */

// Generate performance data over time
const generatePerformanceData = () => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const total = Math.floor(Math.random() * 20) + 10;
        const delivered = Math.floor(total * (0.65 + Math.random() * 0.15));
        const inTransit = Math.floor((total - delivered) * 0.7);
        const created = total - delivered - inTransit;

        data.push({
            date: dateStr,
            total,
            delivered,
            inTransit,
            created,
            onTimeRate: 88 + Math.random() * 10,
        });
    }

    return data;
};

// Generate monthly data
const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const total = Math.floor(Math.random() * 100) + 250;
        const delivered = Math.floor(total * 0.7);
        const inTransit = Math.floor(total * 0.2);
        const created = total - delivered - inTransit;

        data.push({
            month: months[monthIndex],
            total,
            delivered,
            inTransit,
            created,
        });
    }

    return data;
};

export const PERFORMANCE_DATA = {
    // Carrier Performance Metrics
    carrierPerformance: [
        {
            id: 1,
            name: 'Express Logistics',
            onTimeRate: 96.5,
            avgCost: 125.50,
            totalShipments: 145,
            reliability: 98.2,
            rating: 4.8,
            trend: 'up',
            avgTransitTime: 2.3,
        },
        {
            id: 2,
            name: 'Swift Transport',
            onTimeRate: 94.2,
            avgCost: 110.75,
            totalShipments: 98,
            reliability: 95.8,
            rating: 4.6,
            trend: 'up',
            avgTransitTime: 2.8,
        },
        {
            id: 3,
            name: 'Global Freight',
            onTimeRate: 92.5,
            avgCost: 145.00,
            totalShipments: 67,
            reliability: 93.5,
            rating: 4.4,
            trend: 'stable',
            avgTransitTime: 3.1,
        },
        {
            id: 4,
            name: 'Metro Delivery',
            onTimeRate: 97.8,
            avgCost: 95.25,
            totalShipments: 32,
            reliability: 99.1,
            rating: 4.9,
            trend: 'up',
            avgTransitTime: 1.9,
        },
        {
            id: 5,
            name: 'FastTrack Shipping',
            onTimeRate: 89.3,
            avgCost: 132.00,
            totalShipments: 54,
            reliability: 91.2,
            rating: 4.2,
            trend: 'down',
            avgTransitTime: 3.5,
        },
    ],

    // Shipment Performance
    shipmentPerformance: {
        daily: generatePerformanceData(),
        monthly: generateMonthlyData(),
    },

    // Delivery Metrics
    deliveryMetrics: {
        onTime: 324,
        delayed: 15,
        early: 18,
        total: 357,
        rate: 94.7,
        avgDelay: 4.2, // hours
    },

    // Transit Time Analysis by Route
    transitTimeAnalysis: [
        {
            id: 1,
            route: 'New York → Los Angeles',
            avgTime: 3.2,
            targetTime: 3.0,
            performance: 93.3,
            shipments: 45,
        },
        {
            id: 2,
            route: 'Chicago → Houston',
            avgTime: 2.8,
            targetTime: 3.0,
            performance: 107.1,
            shipments: 38,
        },
        {
            id: 3,
            route: 'Miami → Atlanta',
            avgTime: 1.5,
            targetTime: 1.5,
            performance: 100.0,
            shipments: 34,
        },
        {
            id: 4,
            route: 'Seattle → San Francisco',
            avgTime: 2.1,
            targetTime: 2.0,
            performance: 95.2,
            shipments: 29,
        },
        {
            id: 5,
            route: 'Boston → Washington DC',
            avgTime: 1.8,
            targetTime: 2.0,
            performance: 111.1,
            shipments: 26,
        },
    ],

    // Driver Performance
    driverPerformance: [
        {
            id: 1,
            name: 'John Smith',
            deliveries: 156,
            onTimeRate: 98.1,
            rating: 4.9,
            rank: 1,
            avgRating: 4.9,
            completionRate: 99.4,
        },
        {
            id: 2,
            name: 'Mike Johnson',
            deliveries: 142,
            onTimeRate: 96.5,
            rating: 4.7,
            rank: 2,
            avgRating: 4.7,
            completionRate: 98.6,
        },
        {
            id: 3,
            name: 'Sarah Williams',
            deliveries: 138,
            onTimeRate: 95.7,
            rating: 4.8,
            rank: 3,
            avgRating: 4.8,
            completionRate: 97.8,
        },
        {
            id: 4,
            name: 'David Brown',
            deliveries: 129,
            onTimeRate: 94.6,
            rating: 4.6,
            rank: 4,
            avgRating: 4.6,
            completionRate: 96.9,
        },
        {
            id: 5,
            name: 'Emily Davis',
            deliveries: 121,
            onTimeRate: 97.5,
            rating: 4.8,
            rank: 5,
            avgRating: 4.8,
            completionRate: 98.3,
        },
    ],

    // Cost Analysis
    costAnalysis: {
        perShipment: 118.75,
        trend: -2.3, // percentage change
        byCarrier: [
            { carrier: 'Metro Delivery', cost: 95.25, percentage: 20 },
            { carrier: 'Swift Transport', cost: 110.75, percentage: 25 },
            { carrier: 'Express Logistics', cost: 125.50, percentage: 30 },
            { carrier: 'FastTrack Shipping', cost: 132.00, percentage: 15 },
            { carrier: 'Global Freight', cost: 145.00, percentage: 10 },
        ],
        monthly: [
            { month: 'Jan', cost: 122.50 },
            { month: 'Feb', cost: 120.25 },
            { month: 'Mar', cost: 119.80 },
            { month: 'Apr', cost: 121.00 },
            { month: 'May', cost: 118.75 },
            { month: 'Jun', cost: 117.50 },
        ],
    },

    // Route Performance
    routePerformance: [
        {
            id: 1,
            route: 'New York → Los Angeles',
            volume: 45,
            revenue: 67500,
            efficiency: 92.5,
            onTimeRate: 93.3,
            avgCost: 1500,
        },
        {
            id: 2,
            route: 'Chicago → Houston',
            volume: 38,
            revenue: 52250,
            efficiency: 96.8,
            onTimeRate: 97.4,
            avgCost: 1375,
        },
        {
            id: 3,
            route: 'Miami → Atlanta',
            volume: 34,
            revenue: 41650,
            efficiency: 98.2,
            onTimeRate: 100.0,
            avgCost: 1225,
        },
        {
            id: 4,
            route: 'Seattle → San Francisco',
            volume: 29,
            revenue: 38125,
            efficiency: 94.1,
            onTimeRate: 95.2,
            avgCost: 1315,
        },
        {
            id: 5,
            route: 'Boston → Washington DC',
            volume: 26,
            revenue: 31200,
            efficiency: 97.5,
            onTimeRate: 100.0,
            avgCost: 1200,
        },
    ],

    // Performance Summary
    summary: {
        totalShipments: 342,
        avgOnTimeRate: 94.7,
        avgTransitTime: 2.8,
        avgCost: 118.75,
        customerSatisfaction: 4.6,
        efficiency: 95.3,
    },
};

export default PERFORMANCE_DATA;
