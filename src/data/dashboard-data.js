
// Generate today's date and times
const today = new Date();
const formatTime = (hours, minutes) => {
    const d = new Date();
    d.setHours(hours, minutes, 0);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const DASHBOARD_DATA = {
    // Key Statistics
    stats: {
        totalShipments: 156,
        activeShipments: 42,
        deliveredShipments: 98,
        createdShipments: 16,
        inTransitShipments: 26,
    },

    // Recent Activity Log
    recentActivity: [
        {
            id: '1',
            type: 'created',
            shipmentId: 'SHP-2026-055',
            orderId: 'ORD-2026-105',
            status: 'Created',
            message: 'New shipment created for Acme Corp',
            timestamp: new Date(Date.now() - 600000).toISOString(),
        },
        {
            id: '2',
            type: 'status_update',
            shipmentId: 'SHP-2026-042',
            orderId: 'ORD-2026-092',
            status: 'Delivered',
            message: 'Package delivered to reception',
            timestamp: new Date(Date.now() - 1500000).toISOString(),
        },
        {
            id: '3',
            type: 'status_update',
            shipmentId: 'SHP-2026-048',
            orderId: 'ORD-2026-099',
            status: 'In Transit',
            message: 'Driver assigned: John Smith',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: '4',
            type: 'alert',
            shipmentId: 'SHP-2026-038',
            orderId: 'ORD-2026-085',
            status: 'Delayed',
            message: 'Delay resolved - back on schedule',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            id: '5',
            type: 'payment',
            shipmentId: 'SHP-2026-015',
            orderId: 'ORD-2026-060',
            status: 'Completed',
            message: 'Invoice paid in full',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
        {
            id: '6',
            type: 'status_update',
            shipmentId: 'SHP-2026-050',
            orderId: 'ORD-2026-101',
            status: 'In Transit',
            message: 'Arrived at distribution center',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
        {
            id: '7',
            type: 'created',
            shipmentId: 'SHP-2026-056',
            orderId: 'ORD-2026-106',
            status: 'Created',
            message: 'New shipment created for TechCorp',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
        },
    ],

    // Operational Overview
    overview: {
        efficiency: 94.5,
        onTimeRate: 98.2,
        fleetUtilization: 87.5,
    },

    // Status Counts
    statusCounts: {
        created: 16,
        inTransit: 26,
        delivered: 98,
        exception: 3,
        cancelled: 1,
    },

    // Operational Alerts - Urgent items requiring attention
    operationalAlerts: [
        {
            id: 1,
            type: 'urgent',
            priority: 'high',
            title: 'Shipment SHP-2026-045 Delayed',
            message: 'Expected delivery missed by 4 hours - customer notified',
            shipmentId: 'SHP-2026-045',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            actionRequired: true,
        },
        {
            id: 2,
            type: 'documentation',
            priority: 'medium',
            title: 'Missing BOL for 3 Shipments',
            message: 'Bill of Lading required for SHP-2026-042, SHP-2026-043, SHP-2026-044',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            actionRequired: true,
        },
        {
            id: 3,
            type: 'payment',
            priority: 'medium',
            title: '2 Invoices Overdue',
            message: 'INV-2026-012 ($4,500) and INV-2026-015 ($2,800) past due date',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            actionRequired: true,
        },
        {
            id: 4,
            type: 'info',
            priority: 'low',
            title: 'Weather Alert: Route I-80',
            message: 'Heavy snow expected - 3 shipments may experience delays',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            actionRequired: false,
        },
    ],

    // Today's Schedule - Pickups, deliveries, and assignments
    todaySchedule: {
        pickups: [
            {
                id: 1,
                customer: 'Acme Manufacturing',
                location: '1234 Industrial Blvd, Chicago, IL',
                time: formatTime(9, 30),
                status: 'completed',
                driver: 'John Smith',
                shipmentId: 'SHP-2026-048',
            },
            {
                id: 2,
                customer: 'TechCorp Industries',
                location: '5678 Tech Park Dr, Austin, TX',
                time: formatTime(11, 0),
                status: 'in-progress',
                driver: 'Mike Johnson',
                shipmentId: 'SHP-2026-049',
            },
            {
                id: 3,
                customer: 'Global Supplies Inc',
                location: '9012 Commerce Way, Dallas, TX',
                time: formatTime(14, 30),
                status: 'scheduled',
                driver: 'Sarah Williams',
                shipmentId: 'SHP-2026-050',
            },
            {
                id: 4,
                customer: 'Metro Distribution',
                location: '3456 Warehouse Rd, Houston, TX',
                time: formatTime(16, 0),
                status: 'scheduled',
                driver: 'David Brown',
                shipmentId: 'SHP-2026-051',
            },
        ],
        deliveries: [
            {
                id: 1,
                customer: 'Retail Solutions LLC',
                location: '7890 Market St, San Francisco, CA',
                time: formatTime(10, 0),
                status: 'completed',
                driver: 'John Smith',
                shipmentId: 'SHP-2026-035',
            },
            {
                id: 2,
                customer: 'BuildRight Construction',
                location: '2345 Builder Ave, Phoenix, AZ',
                time: formatTime(13, 30),
                status: 'in-transit',
                driver: 'Mike Johnson',
                shipmentId: 'SHP-2026-038',
            },
            {
                id: 3,
                customer: 'FreshMart Grocers',
                location: '6789 Food Plaza, Seattle, WA',
                time: formatTime(15, 0),
                status: 'in-transit',
                driver: 'Sarah Williams',
                shipmentId: 'SHP-2026-040',
            },
        ],
        driverAssignments: [
            {
                id: 1,
                driver: 'John Smith',
                vehicle: 'TRK-101',
                route: 'Chicago → San Francisco',
                shipments: 3,
                status: 'active',
            },
            {
                id: 2,
                driver: 'Mike Johnson',
                vehicle: 'TRK-205',
                route: 'Austin → Phoenix',
                shipments: 2,
                status: 'active',
            },
            {
                id: 3,
                driver: 'Sarah Williams',
                vehicle: 'TRK-308',
                route: 'Dallas → Seattle',
                shipments: 4,
                status: 'active',
            },
            {
                id: 4,
                driver: 'David Brown',
                vehicle: 'TRK-412',
                route: 'Houston → Denver',
                shipments: 2,
                status: 'scheduled',
            },
        ],
    },

    // Pending Actions - Items awaiting user action
    pendingActions: [
        {
            id: 1,
            type: 'quote',
            title: 'Quote Request from Acme Corp',
            description: 'Bulk shipment quote for 50 pallets NYC to LA',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'high',
            relatedEntity: 'QUOTE-2026-023',
        },
        {
            id: 2,
            type: 'approval',
            title: 'Rate Change Approval Needed',
            description: 'Express Logistics increased rates by 8% - review required',
            dueDate: new Date(Date.now() + 172800000).toISOString(),
            priority: 'medium',
            relatedEntity: 'CARRIER-015',
        },
        {
            id: 3,
            type: 'documentation',
            title: 'Insurance Certificate Expiring',
            description: 'Vehicle TRK-205 insurance expires in 7 days',
            dueDate: new Date(Date.now() + 604800000).toISOString(),
            priority: 'medium',
            relatedEntity: 'TRK-205',
        },
        {
            id: 4,
            type: 'customer',
            title: 'Customer Inquiry - TechCorp',
            description: 'Requesting dedicated route pricing for Q2',
            dueDate: new Date(Date.now() + 259200000).toISOString(),
            priority: 'low',
            relatedEntity: 'CUST-089',
        },
        {
            id: 5,
            type: 'invoice',
            title: 'Invoice Dispute Resolution',
            description: 'Customer questioning charges on INV-2026-018',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'high',
            relatedEntity: 'INV-2026-018',
        },
    ],

    // Vehicle Fleet Status
    vehicleStatus: {
        available: 8,
        totalVehicles: 24,
        inUse: [
            {
                id: 1,
                vehicle: 'TRK-101',
                type: 'Semi Truck',
                driver: 'John Smith',
                route: 'Chicago → San Francisco',
                currentLocation: 'Denver, CO',
                eta: formatTime(18, 30),
                capacity: '85%',
            },
            {
                id: 2,
                vehicle: 'TRK-205',
                type: 'Box Truck',
                driver: 'Mike Johnson',
                route: 'Austin → Phoenix',
                currentLocation: 'El Paso, TX',
                eta: formatTime(16, 0),
                capacity: '92%',
            },
            {
                id: 3,
                vehicle: 'TRK-308',
                type: 'Semi Truck',
                driver: 'Sarah Williams',
                route: 'Dallas → Seattle',
                currentLocation: 'Salt Lake City, UT',
                eta: formatTime(20, 0),
                capacity: '78%',
            },
            {
                id: 4,
                vehicle: 'TRK-412',
                type: 'Cargo Van',
                driver: 'David Brown',
                route: 'Houston → Denver',
                currentLocation: 'Amarillo, TX',
                eta: formatTime(17, 30),
                capacity: '65%',
            },
        ],
        maintenance: [
            {
                id: 1,
                vehicle: 'TRK-156',
                type: 'Semi Truck',
                issue: 'Scheduled maintenance',
                expectedReturn: new Date(Date.now() + 172800000).toISOString(),
            },
            {
                id: 2,
                vehicle: 'TRK-289',
                type: 'Box Truck',
                issue: 'Brake system repair',
                expectedReturn: new Date(Date.now() + 86400000).toISOString(),
            },
        ],
        totalCapacity: 100,
        usedCapacity: 67,
    },

    // Customer Service Queue
    customerServiceQueue: [
        {
            id: 1,
            customer: 'Acme Manufacturing',
            type: 'inquiry',
            subject: 'Tracking update for SHP-2026-045',
            priority: 'high',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'open',
        },
        {
            id: 2,
            customer: 'TechCorp Industries',
            type: 'quote',
            subject: 'Bulk shipping rates for Q2 2026',
            priority: 'medium',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'open',
        },
        {
            id: 3,
            customer: 'Global Supplies Inc',
            type: 'issue',
            subject: 'Damaged package report - SHP-2026-038',
            priority: 'high',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'in-progress',
        },
        {
            id: 4,
            customer: 'Retail Solutions LLC',
            type: 'feedback',
            subject: 'Excellent service feedback',
            priority: 'low',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            status: 'open',
        },
        {
            id: 5,
            customer: 'BuildRight Construction',
            type: 'inquiry',
            subject: 'Delivery confirmation needed',
            priority: 'medium',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            status: 'open',
        },
    ],

    // System Notifications
    systemNotifications: [
        {
            id: 1,
            type: 'inventory',
            title: 'Low Packing Material Stock',
            message: 'Bubble wrap and boxes running low - reorder recommended',
            severity: 'warning',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 2,
            type: 'license',
            title: 'DOT License Renewal Due',
            message: '3 drivers have DOT licenses expiring within 30 days',
            severity: 'warning',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
            id: 3,
            type: 'system',
            title: 'System Backup Completed',
            message: 'Daily backup completed successfully at 2:00 AM',
            severity: 'info',
            timestamp: new Date(Date.now() - 43200000).toISOString(),
        },
    ],
};

export default DASHBOARD_DATA;
