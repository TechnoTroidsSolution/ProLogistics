import axiosClient from './axiosClient';

// Demo data for analytics
const generateShipmentTrends = () => {
    const trends = [];
    const today = new Date();

    for (let i = 10; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate realistic shipment counts with some variation
        const baseCount = 500;
        const variation = Math.floor(Math.random() * 10) - 5;
        const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? -5 : 0;
        const count = Math.max(100, baseCount + variation + weekendFactor);

        trends.push({
            date: dateStr,
            count,
            delivered: Math.floor(count * 0.7),
            inTransit: Math.floor(count * 0.2),
            created: Math.floor(count * 0.1),
        });
    }

    return trends;
};

const generateRevenueByMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const revenue = [];

    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const baseRevenue = 45000;
        const variation = Math.floor(Math.random() * 15000) - 7500;

        revenue.push({
            month: months[monthIndex],
            revenue: Math.max(30000, baseRevenue + variation),
            shipments: Math.floor(Math.random() * 100) + 300,
        });
    }

    return revenue;
};

const DEMO_ANALYTICS_DATA = {
    overview: {
        totalRevenue: 487650,
        revenueChange: 12.5,
        shipmentsThisMonth: 342,
        shipmentsChange: 8.3,
        onTimeDeliveryRate: 94.7,
        deliveryChange: 2.1,
        avgTransitTime: 2.8,
        transitChange: -0.3,
    },

    shipmentTrends: generateShipmentTrends(),

    statusDistribution: [
        { status: 'Delivered', count: 234, percentage: 68.4, color: 'green' },
        { status: 'In Transit', count: 78, percentage: 22.8, color: 'amber' },
        { status: 'Created', count: 30, percentage: 8.8, color: 'gray' },
    ],

    carrierPerformance: [
        {
            id: 1,
            name: 'Express Logistics',
            shipments: 145,
            onTimeRate: 96.5,
            avgCost: 125.50,
            totalRevenue: 18197.50,
        },
        {
            id: 2,
            name: 'Swift Transport',
            shipments: 98,
            onTimeRate: 94.2,
            avgCost: 110.75,
            totalRevenue: 10853.50,
        },
        {
            id: 3,
            name: 'Global Freight',
            shipments: 67,
            onTimeRate: 92.5,
            avgCost: 145.00,
            totalRevenue: 9715.00,
        },
        {
            id: 4,
            name: 'Metro Delivery',
            shipments: 32,
            onTimeRate: 97.8,
            avgCost: 95.25,
            totalRevenue: 3048.00,
        },
    ],

    topRoutes: [
        {
            id: 1,
            origin: 'New York, NY',
            destination: 'Los Angeles, CA',
            shipments: 45,
            revenue: 67500,
            avgTransitTime: 3.2,
        },
        {
            id: 2,
            origin: 'Chicago, IL',
            destination: 'Houston, TX',
            shipments: 38,
            revenue: 52250,
            avgTransitTime: 2.8,
        },
        {
            id: 3,
            origin: 'Miami, FL',
            destination: 'Atlanta, GA',
            shipments: 34,
            revenue: 41650,
            avgTransitTime: 1.5,
        },
        {
            id: 4,
            origin: 'Seattle, WA',
            destination: 'San Francisco, CA',
            shipments: 29,
            revenue: 38125,
            avgTransitTime: 2.1,
        },
        {
            id: 5,
            origin: 'Boston, MA',
            destination: 'Washington, DC',
            shipments: 26,
            revenue: 31200,
            avgTransitTime: 1.8,
        },
    ],

    revenueByMonth: generateRevenueByMonth(),


    insights: [
        {
            id: 1,
            type: 'capacity',
            title: 'Vehicle Capacity Alert',
            message: '3 vehicles approaching 90% capacity this week - consider adding backup units',
            severity: 'attention',
            action: 'View Fleet Status',
        },
        {
            id: 2,
            type: 'cost',
            title: 'Cost Optimization Opportunity',
            message: 'Route NYC-LA can save $450 per shipment by switching to Express Logistics',
            severity: 'neutral',
            action: 'Review Carriers',
        },
        {
            id: 3,
            type: 'delivery',
            title: 'Delivery Risk Alert',
            message: '5 shipments at risk of delay due to weather - proactive customer notification sent',
            severity: 'critical',
            action: 'View Shipments',
        },
        {
            id: 4,
            type: 'revenue',
            title: 'Revenue Opportunity',
            message: '15 repeat customers eligible for volume discounts - potential $8,500 monthly increase',
            severity: 'positive',
            action: 'View Customers',
        },
        {
            id: 5,
            type: 'efficiency',
            title: 'Route Consolidation',
            message: 'Consolidating 8 shipments on CHI-HOU route can save $1,200 this week',
            severity: 'neutral',
            action: 'Optimize Routes',
        },
        {
            id: 6,
            type: 'customer',
            title: 'Customer Retention Alert',
            message: '2 high-value customers (avg $12K/month) haven\'t shipped in 30 days',
            severity: 'attention',
            action: 'Contact Customers',
        },
    ],

    performanceMetrics: {
        customerSatisfaction: 4.6,
        averageRating: 4.8,
        repeatCustomerRate: 78.5,
        claimRate: 0.8,
    },
};

export const analyticsApi = {
    /**
     * Get complete analytics overview
     * @returns {Promise<Object>} Complete analytics data
     */
    getAnalyticsOverview: async () => {
        try {
            const response = await axiosClient.get('/analytics/overview');
            return response.data;
        } catch (error) {
            // Return demo data if API fails
            console.warn('Using demo analytics data');
            return DEMO_ANALYTICS_DATA;
        }
    },

    /**
     * Get shipment trends over time
     * @param {number} days - Number of days to fetch
     * @returns {Promise<Array>} Shipment trends
     */
    getShipmentTrends: async (days = 30) => {
        try {
            const response = await axiosClient.get('/analytics/shipment-trends', {
                params: { days },
            });
            return response.data;
        } catch (error) {
            return DEMO_ANALYTICS_DATA.shipmentTrends;
        }
    },

    /**
     * Get carrier performance metrics
     * @returns {Promise<Array>} Carrier performance data
     */
    getCarrierPerformance: async () => {
        try {
            const response = await axiosClient.get('/analytics/carrier-performance');
            return response.data;
        } catch (error) {
            return DEMO_ANALYTICS_DATA.carrierPerformance;
        }
    },

    /**
     * Get top performing routes
     * @param {number} limit - Number of routes to return
     * @returns {Promise<Array>} Top routes
     */
    getTopRoutes: async (limit = 5) => {
        try {
            const response = await axiosClient.get('/analytics/top-routes', {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            return DEMO_ANALYTICS_DATA.topRoutes.slice(0, limit);
        }
    },

    /**
     * Get revenue analytics by month
     * @returns {Promise<Array>} Revenue by month
     */
    getRevenueByMonth: async () => {
        try {
            const response = await axiosClient.get('/analytics/revenue-by-month');
            return response.data;
        } catch (error) {
            return DEMO_ANALYTICS_DATA.revenueByMonth;
        }
    },

    /**
     * Get actionable insights
     * @returns {Promise<Array>} Analytics insights
     */
    getInsights: async () => {
        try {
            const response = await axiosClient.get('/analytics/insights');
            return response.data;
        } catch (error) {
            return DEMO_ANALYTICS_DATA.insights;
        }
    },
};

export default analyticsApi;
