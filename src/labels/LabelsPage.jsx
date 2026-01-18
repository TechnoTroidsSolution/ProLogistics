import { useState } from 'react';
import { Link } from 'react-router-dom';
import LabelGenerator from './LabelGenerator';
import {
  Barcode,
  Package,
  Printer,
  Download,
  Search,
  Settings,
  History,
  Zap,
  Boxes,
  QrCode,
} from 'lucide-react';

/**
 * Labels Page
 * Central hub for generating and managing shipping labels
 */
export default function LabelsPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Demo recent labels
  const recentLabels = [
    { id: 'LBL-001', shipmentId: 'SHP-2026-001', createdAt: '2026-01-10T14:30:00Z', destination: 'Los Angeles, CA' },
    { id: 'LBL-002', shipmentId: 'SHP-2026-002', createdAt: '2026-01-10T10:15:00Z', destination: 'Chicago, IL' },
    { id: 'LBL-003', shipmentId: 'SHP-2026-003', createdAt: '2026-01-09T16:45:00Z', destination: 'New York, NY' },
    { id: 'LBL-004', shipmentId: 'SHP-2026-004', createdAt: '2026-01-09T09:00:00Z', destination: 'Miami, FL' },
  ];

  // Demo shipments for label generation
  const availableShipments = [
    {
      id: 'SHP-2026-005',
      trackingNumber: 'TRK9876543210',
      origin: { name: 'Warehouse A', address: '100 Industrial Way', city: 'San Francisco', state: 'CA', zip: '94102' },
      destination: { name: 'Customer XYZ', address: '200 Main Street', city: 'Seattle', state: 'WA', zip: '98101' },
      weight: 15.5,
      serviceType: 'Standard',
      packages: 2,
      estimatedDelivery: '2026-01-18',
    },
    {
      id: 'SHP-2026-006',
      trackingNumber: 'TRK1122334455',
      origin: { name: 'Distribution Center', address: '500 Logistics Blvd', city: 'Los Angeles', state: 'CA', zip: '90001' },
      destination: { name: 'ABC Corp', address: '750 Business Park', city: 'Phoenix', state: 'AZ', zip: '85001' },
      weight: 32.0,
      serviceType: 'Express',
      packages: 1,
      estimatedDelivery: '2026-01-14',
    },
  ];

  const handleGenerateLabel = (shipment = null) => {
    setSelectedShipment(shipment);
    setShowGenerator(true);
  };

  const features = [
    {
      icon: Printer,
      title: 'Print Ready',
      description: 'Labels optimized for thermal printers',
    },
    {
      icon: Barcode,
      title: 'Barcodes & QR',
      description: 'Auto-generated tracking codes',
    },
    {
      icon: Boxes,
      title: 'Bulk Generation',
      description: 'Create multiple labels at once',
    },
    {
      icon: Zap,
      title: 'Quick Access',
      description: 'Generate from any shipment',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Labels</h1>
          <p className="text-gray-600 mt-1">Generate and print shipping labels</p>
        </div>
        <button
          onClick={() => handleGenerateLabel()}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Barcode size={20} />
          Generate Label
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Generate */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-gray-500" />
              Generate for Shipment
            </h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Shipment List */}
            <div className="space-y-3">
              {availableShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="font-mono font-medium text-gray-900">{shipment.id}</p>
                      <p className="text-sm text-gray-500">
                        {shipment.origin.city} → {shipment.destination.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipment.serviceType === 'Express' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {shipment.serviceType}
                    </span>
                    <button
                      onClick={() => handleGenerateLabel(shipment)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Generate Label"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/shipments"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all shipments →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Labels */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History size={18} className="text-gray-500" />
              Recent Labels
            </h3>
            <div className="space-y-3">
              {recentLabels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900">{label.shipmentId}</p>
                    <p className="text-xs text-gray-500">{label.destination}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                      title="Reprint"
                    >
                      <Printer size={14} />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Label Format Info */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100 p-6 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <QrCode className="text-primary-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Supported Formats</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                4" × 6" Standard Label
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                4" × 4" Compact Label
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                2" × 4" Small Label
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Label Generator Modal */}
      {showGenerator && (
        <LabelGenerator
          shipment={selectedShipment}
          onClose={() => {
            setShowGenerator(false);
            setSelectedShipment(null);
          }}
        />
      )}
    </div>
  );
}
