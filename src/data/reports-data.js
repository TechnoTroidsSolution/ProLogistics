/**
 * Reports Mock Data & Schema Definitions
 */

// Available schemas/tables for reporting
export const REPORT_SCHEMAS = [
    { id: 'shipments', name: 'Shipments', icon: 'Package' },
    { id: 'carriers', name: 'Carriers', icon: 'Truck' },
    { id: 'drivers', name: 'Drivers', icon: 'User' },
    { id: 'financials', name: 'Financials', icon: 'DollarSign' },
];

// Available columns for each schema
export const SCHEMA_COLUMNS = {
    shipments: [
        { id: 'id', name: 'Shipment ID', type: 'text' },
        { id: 'tracking_number', name: 'Tracking Number', type: 'text' },
        { id: 'status', name: 'Status', type: 'select', options: ['Created', 'In Transit', 'Delivered', 'Exception'] },
        { id: 'origin', name: 'Origin', type: 'text' },
        { id: 'destination', name: 'Destination', type: 'text' },
        { id: 'carrier', name: 'Carrier', type: 'text' },
        { id: 'service_type', name: 'Service Type', type: 'select', options: ['LTL', 'FTL', 'Parcel'] },
        { id: 'weight', name: 'Weight (lbs)', type: 'number' },
        { id: 'cost', name: 'Cost', type: 'currency' },
        { id: 'pickup_date', name: 'Pickup Date', type: 'date' },
        { id: 'delivery_date', name: 'Delivery Date', type: 'date' },
        { id: 'on_time', name: 'On Time', type: 'boolean' },
    ],
    carriers: [
        { id: 'id', name: 'Carrier ID', type: 'text' },
        { id: 'name', name: 'Carrier Name', type: 'text' },
        { id: 'service_area', name: 'Service Area', type: 'text' },
        { id: 'rating', name: 'Rating', type: 'number' },
        { id: 'active_vehicles', name: 'Active Vehicles', type: 'number' },
        { id: 'total_shipments', name: 'Total Shipments', type: 'number' },
        { id: 'on_time_rate', name: 'On-Time Rate', type: 'percentage' },
        { id: 'avg_cost_per_mile', name: 'Avg Cost/Mile', type: 'currency' },
        { id: 'contract_status', name: 'Contract Status', type: 'select', options: ['Active', 'Pending', 'Expired'] },
    ],
    drivers: [
        { id: 'id', name: 'Driver ID', type: 'text' },
        { id: 'name', name: 'Full Name', type: 'text' },
        { id: 'license_number', name: 'License #', type: 'text' },
        { id: 'phone', name: 'Phone', type: 'text' },
        { id: 'status', name: 'Status', type: 'select', options: ['Available', 'On Duty', 'Off Duty'] },
        { id: 'current_vehicle', name: 'Current Vehicle', type: 'text' },
        { id: 'safety_rating', name: 'Safety Rating', type: 'number' },
        { id: 'years_experience', name: 'Experience (Yrs)', type: 'number' },
    ],
    financials: [
        { id: 'invoice_id', name: 'Invoice ID', type: 'text' },
        { id: 'shipment_id', name: 'Shipment ID', type: 'text' },
        { id: 'amount', name: 'Amount', type: 'currency' },
        { id: 'status', name: 'Payment Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'] },
        { id: 'due_date', name: 'Due Date', type: 'date' },
        { id: 'client_name', name: 'Client Name', type: 'text' },
        { id: 'cost_center', name: 'Cost Center', type: 'text' },
    ]
};

// saved reports (Mock DB)
export const SAVED_REPORTS = [
    {
        id: 1,
        name: 'Monthly Shipment Costs',
        description: 'Detailed breakdown of shipment costs by carrier for the current month',
        schema: 'shipments',
        columns: ['tracking_number', 'carrier', 'service_type', 'cost', 'delivery_date', 'status'],
        filters: [
            { column: 'status', operator: 'equals', value: 'Delivered' },
            { column: 'delivery_date', operator: 'last_n_days', value: 30 }
        ],
        lastRun: '2 hours ago',
        createdBy: 'Admin User'
    },
    {
        id: 2,
        name: 'Carrier Performance Report',
        description: 'Analysis of carrier on-time rates and average costs',
        schema: 'carriers',
        columns: ['name', 'rating', 'total_shipments', 'on_time_rate', 'avg_cost_per_mile'],
        filters: [
            { column: 'contract_status', operator: 'equals', value: 'Active' },
            { column: 'rating', operator: 'greater_than', value: 4.0 }
        ],
        lastRun: '1 day ago',
        createdBy: 'Logistics Manager'
    },
    {
        id: 3,
        name: 'LTL Shipment Analysis',
        description: 'Overview of all LTL shipments with weight and cost data',
        schema: 'shipments',
        columns: ['tracking_number', 'origin', 'destination', 'weight', 'cost', 'on_time'],
        filters: [
            { column: 'service_type', operator: 'equals', value: 'LTL' }
        ],
        lastRun: '3 days ago',
        createdBy: 'Analyst'
    }
];

// Helper to generate mock data for preview
export const generateReportData = (schema, selectedColumnIds, rowCount = 10) => {
    const data = [];
    const columns = SCHEMA_COLUMNS[schema];

    if (!columns) return [];

    const getMockValue = (col) => {
        switch (col.type) {
            case 'text':
                if (col.id === 'tracking_number') return `TRK-${Math.floor(Math.random() * 1000000)}`;
                if (col.id === 'carrier') return ['Express Logistics', 'Swift Transport', 'Global Freight'][Math.floor(Math.random() * 3)];
                if (col.id === 'origin') return ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX'][Math.floor(Math.random() * 4)];
                if (col.id === 'destination') return ['Miami, FL', 'Seattle, WA', 'Denver, CO', 'Boston, MA'][Math.floor(Math.random() * 4)];
                return `${col.name} ${Math.floor(Math.random() * 100)}`;
            case 'number':
                return Math.floor(Math.random() * 1000);
            case 'currency':
                return (Math.random() * 500 + 50).toFixed(2);
            case 'percentage':
                return (Math.random() * 20 + 80).toFixed(1); // 80-100%
            case 'select':
                return col.options[Math.floor(Math.random() * col.options.length)];
            case 'date':
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30));
                return date.toLocaleDateString();
            case 'boolean':
                return Math.random() > 0.1 ? 'Yes' : 'No';
            default:
                return '-';
        }
    };

    for (let i = 0; i < rowCount; i++) {
        const row = {};
        selectedColumnIds.forEach(colId => {
            const col = columns.find(c => c.id === colId);
            if (col) {
                row[colId] = getMockValue(col);
            }
        });
        data.push({ id: i, ...row });
    }

    return data;
};
