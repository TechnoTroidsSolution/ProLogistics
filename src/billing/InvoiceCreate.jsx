import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBillingStore } from './billing.store';
import { useShipmentStore } from '../shipments/shipment.store';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Package,
  User,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';

/**
 * Invoice Create Page
 * Create new invoices from scratch or from shipments
 */
export default function InvoiceCreate() {
  const navigate = useNavigate();
  const { createInvoice, createInvoiceFromShipment, isLoading } = useBillingStore();
  const { shipments } = useShipmentStore();
  
  const [mode, setMode] = useState('manual'); // 'manual' or 'shipment'
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchShipment, setSearchShipment] = useState('');
  
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
  });

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    
    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      const newItems = invoiceData.items.filter((_, i) => i !== index);
      setInvoiceData({ ...invoiceData, items: newItems });
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'shipment' && selectedShipment) {
      await createInvoiceFromShipment(selectedShipment.id);
    } else {
      await createInvoice({
        ...invoiceData,
        subtotal,
        tax,
        taxRate: 0.08,
        total,
      });
    }
    
    navigate('/billing/invoices');
  };

  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    setInvoiceData({
      ...invoiceData,
      customerName: shipment.customer || 'Customer Name',
      customerEmail: shipment.customerEmail || 'customer@example.com',
      items: [
        { 
          description: `Shipping Service - ${shipment.type || 'Standard'}`,
          details: `${shipment.origin?.city || 'Origin'} → ${shipment.destination?.city || 'Destination'}`,
          quantity: 1, 
          rate: shipment.cost || 250, 
          amount: shipment.cost || 250 
        }
      ]
    });
  };

  const filteredShipments = shipments.filter(s => 
    s.id.toLowerCase().includes(searchShipment.toLowerCase()) ||
    (s.customer && s.customer.toLowerCase().includes(searchShipment.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600">Generate a new invoice</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <FileText className="inline mr-2" size={18} />
            Manual Invoice
          </button>
          <button
            onClick={() => setMode('shipment')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'shipment'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <Package className="inline mr-2" size={18} />
            From Shipment
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Selection (if mode === 'shipment') */}
          {mode === 'shipment' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Shipment</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by shipment ID or customer..."
                  value={searchShipment}
                  onChange={(e) => setSearchShipment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredShipments.slice(0, 10).map((shipment) => (
                  <button
                    key={shipment.id}
                    type="button"
                    onClick={() => handleSelectShipment(shipment)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedShipment?.id === shipment.id
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono font-medium text-gray-900">{shipment.id}</p>
                        <p className="text-sm text-gray-600">{shipment.customer || 'No customer'}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">${shipment.cost || 0}</span>
                    </div>
                  </button>
                ))}
                {filteredShipments.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No shipments found</p>
                )}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={invoiceData.customerName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Customer name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={invoiceData.customerEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    value={invoiceData.customerAddress}
                    onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Billing address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Line Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                    <p className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                      ${item.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-1 pt-6">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={invoiceData.items.length === 1}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Payment terms, special instructions, etc."
            />
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          {/* Due Date */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/billing/invoices')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
