import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Printer,
  Download,
  Package,
  MapPin,
  Phone,
  Barcode,
  QrCode,
  Truck,
  Clock,
  Weight,
  Box,
  ArrowRight,
  Copy,
  Check,
  Settings,
  RefreshCw,
} from 'lucide-react';

/**
 * Shipping Label Generator Component
 * Generates and prints shipping labels with barcodes
 */
export default function LabelGenerator({ shipment, onClose }) {
  const labelRef = useRef(null);
  const [labelSize, setLabelSize] = useState('4x6'); // 4x6, 4x4, 2x4
  const [labelCount, setLabelCount] = useState(1);
  const [showBarcode, setShowBarcode] = useState(true);
  const [showQRCode, setShowQRCode] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate a barcode pattern (simplified visual representation)
  const generateBarcodePattern = (text) => {
    // Simple pattern generation for visual effect
    const pattern = [];
    for (let i = 0; i < text.length * 3; i++) {
      const width = (i % 3 === 0) ? 2 : (i % 2 === 0) ? 1 : 3;
      pattern.push(width);
    }
    return pattern;
  };

  // Generate QR code pattern (simplified visual representation)
  const generateQRPattern = () => {
    const size = 21; // 21x21 modules for version 1 QR code
    const pattern = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create finder patterns in corners
        if ((i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7)) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || j === 14 || j === 20 ||
              (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
              (i >= 2 && i <= 4 && j >= 16 && j <= 18) ||
              (i >= 16 && i <= 18 && j >= 2 && j <= 4)) {
            row.push(1);
          } else {
            row.push(0);
          }
        } else {
          // Random data pattern for visual effect
          row.push(Math.random() > 0.5 ? 1 : 0);
        }
      }
      pattern.push(row);
    }
    return pattern;
  };

  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: `Label-${shipment?.id || 'SHIP'}`,
    pageStyle: `
      @page {
        size: ${labelSize === '4x6' ? '4in 6in' : labelSize === '4x4' ? '4in 4in' : '2in 4in'};
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(shipment?.trackingNumber || shipment?.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const barcodePattern = generateBarcodePattern(shipment?.trackingNumber || shipment?.id || 'DEMO');
  const qrPattern = generateQRPattern();

  // Demo shipment if none provided
  const labelData = shipment || {
    id: 'SHP-2026-001',
    trackingNumber: 'TRK1234567890',
    origin: {
      name: 'TechCorp Industries',
      address: '456 Tech Plaza',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      phone: '+1 (555) 123-4567',
    },
    destination: {
      name: 'Global Retail Co',
      address: '789 Commerce Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      phone: '+1 (555) 234-5678',
    },
    weight: 25.5,
    dimensions: { length: 24, width: 18, height: 12 },
    serviceType: 'Express',
    estimatedDelivery: '2026-01-15',
    packages: 1,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Barcode className="text-primary-600" size={24} />
            Generate Shipping Label
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Panel */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Settings size={16} />
                Label Settings
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label Size</label>
                  <select
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="4x6">4" × 6" (Standard)</option>
                    <option value="4x4">4" × 4" (Compact)</option>
                    <option value="2x4">2" × 4" (Small)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Number of Labels</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={labelCount}
                    onChange={(e) => setLabelCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">Show Barcode</label>
                  <button
                    onClick={() => setShowBarcode(!showBarcode)}
                    className={`w-10 h-5 rounded-full transition-colors ${showBarcode ? 'bg-primary-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${showBarcode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">Show QR Code</label>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className={`w-10 h-5 rounded-full transition-colors ${showQRCode ? 'bg-primary-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${showQRCode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipment Info</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono font-medium">{labelData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-medium">{labelData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight:</span>
                  <span className="font-medium">{labelData.weight} lbs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tracking:</span>
                  <button
                    onClick={copyTrackingNumber}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                  >
                    <span className="font-mono font-medium">{labelData.trackingNumber}</span>
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Label
              </button>
              <button
                className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Label Preview */}
          <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <div className="flex justify-center">
              <div
                ref={labelRef}
                className={`bg-white shadow-lg ${
                  labelSize === '4x6' ? 'w-[4in] min-h-[6in]' :
                  labelSize === '4x4' ? 'w-[4in] min-h-[4in]' :
                  'w-[2in] min-h-[4in]'
                }`}
                style={{ padding: '0.25in' }}
              >
                {/* Label Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="text-black" size={labelSize === '2x4' ? 16 : 24} />
                    <span className={`font-black ${labelSize === '2x4' ? 'text-sm' : 'text-xl'}`}>LogiTrack</span>
                  </div>
                  <div className={`px-2 py-1 bg-black text-white font-bold ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>
                    {labelData.serviceType.toUpperCase()}
                  </div>
                </div>

                {/* From / To Section */}
                <div className={`grid ${labelSize === '2x4' ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'} mb-4`}>
                  {/* From */}
                  <div>
                    <p className={`font-bold uppercase text-gray-500 ${labelSize === '2x4' ? 'text-[8px]' : 'text-xs'} mb-1`}>From:</p>
                    <p className={`font-bold ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>{labelData.origin.name}</p>
                    <p className={labelSize === '2x4' ? 'text-[8px]' : 'text-xs'}>{labelData.origin.address}</p>
                    <p className={labelSize === '2x4' ? 'text-[8px]' : 'text-xs'}>
                      {labelData.origin.city}, {labelData.origin.state} {labelData.origin.zip}
                    </p>
                  </div>

                  {/* To */}
                  <div className={labelSize === '2x4' ? 'border-t border-dashed border-gray-400 pt-2' : ''}>
                    <p className={`font-bold uppercase text-gray-500 ${labelSize === '2x4' ? 'text-[8px]' : 'text-xs'} mb-1`}>To:</p>
                    <p className={`font-black ${labelSize === '2x4' ? 'text-sm' : 'text-lg'}`}>{labelData.destination.name}</p>
                    <p className={`font-medium ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>{labelData.destination.address}</p>
                    <p className={`font-bold ${labelSize === '2x4' ? 'text-sm' : 'text-base'}`}>
                      {labelData.destination.city}, {labelData.destination.state} {labelData.destination.zip}
                    </p>
                  </div>
                </div>

                {/* Barcode */}
                {showBarcode && (
                  <div className="border-t border-b border-gray-300 py-3 my-3">
                    <div className="flex justify-center items-end h-12 gap-[1px]">
                      {barcodePattern.map((width, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: `${width}px`,
                            height: `${30 + (i % 5) * 2}px`,
                          }}
                        />
                      ))}
                    </div>
                    <p className={`text-center font-mono font-bold mt-2 ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>
                      {labelData.trackingNumber}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className={`grid ${labelSize === '2x4' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-3`}>
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <p className="text-[8px] text-gray-500 uppercase">Weight</p>
                    <p className={`font-bold ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>{labelData.weight} lbs</p>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <p className="text-[8px] text-gray-500 uppercase">Packages</p>
                    <p className={`font-bold ${labelSize === '2x4' ? 'text-xs' : 'text-sm'}`}>{labelData.packages}</p>
                  </div>
                  {labelSize !== '2x4' && (
                    <div className="text-center p-2 bg-gray-100 rounded">
                      <p className="text-[8px] text-gray-500 uppercase">Est. Delivery</p>
                      <p className={`font-bold text-sm`}>{new Date(labelData.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* QR Code and Shipment ID */}
                {showQRCode && labelSize !== '2x4' && (
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase mb-1">Scan for tracking</p>
                      <div className="w-16 h-16 bg-white border border-gray-300 p-1">
                        <div className="grid grid-cols-[repeat(21,1fr)] gap-0 w-full h-full">
                          {qrPattern.flat().map((cell, i) => (
                            <div
                              key={i}
                              className={cell ? 'bg-black' : 'bg-white'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-500 uppercase">Shipment ID</p>
                      <p className="font-mono font-bold text-lg">{labelData.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
