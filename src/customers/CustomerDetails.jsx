import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomerStore } from './customer.store';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  ArrowLeft,
  Edit,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  FileText,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';

/**
 * Customer Details Page
 * Displays full customer profile with shipments and invoices
 */
export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCustomer, isLoading, fetchCustomerById, updateCustomerStatus } = useCustomerStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCustomerById(id);
  }, [id, fetchCustomerById]);

  if (isLoading || !currentCustomer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const TypeIcon = currentCustomer.type === 'business' ? Building : User;

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      suspended: 'red',
    };
    return colors[status] || 'gray';
  };

  const statusColor = getStatusColor(currentCustomer.status);

  // Mock recent shipments
  const recentShipments = [
    { id: 'SHP-2026-001', date: '2026-01-10', destination: 'Los Angeles, CA', status: 'delivered', cost: 450 },
    { id: 'SHP-2026-002', date: '2026-01-08', destination: 'Chicago, IL', status: 'in_transit', cost: 320 },
    { id: 'SHP-2026-003', date: '2026-01-05', destination: 'New York, NY', status: 'delivered', cost: 580 },
  ];

  // Mock recent invoices
  const recentInvoices = [
    { id: 'INV-2026-001', date: '2026-01-10', amount: 1250, status: 'paid' },
    { id: 'INV-2026-002', date: '2026-01-05', amount: 890, status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${currentCustomer.type === 'business' ? 'bg-blue-100' : 'bg-purple-100'}`}>
              <TypeIcon className={currentCustomer.type === 'business' ? 'text-blue-600' : 'text-purple-600'} size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{currentCustomer.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  statusColor === 'green' ? 'bg-green-100 text-green-700' :
                  statusColor === 'red' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentCustomer.status}
                </span>
              </div>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <span className="font-mono text-sm">{currentCustomer.id}</span>
                <span className="text-gray-300">•</span>
                <span className="capitalize">{currentCustomer.type}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/customers/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit size={18} />
            Edit
          </Link>
          <Link
            to="/shipments/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Package size={18} />
            New Shipment
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {['overview', 'shipments', 'invoices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="text-gray-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-gray-900">{currentCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="text-gray-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900">{currentCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="text-gray-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-gray-900">{currentCustomer.address}</p>
                    </div>
                  </div>
                  {currentCustomer.contactPerson && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="text-gray-600" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contact Person</p>
                        <p className="text-gray-900">{currentCustomer.contactPerson}</p>
                        <p className="text-xs text-gray-500">{currentCustomer.contactRole}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Shipments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Shipments</h3>
                  <button
                    onClick={() => setActiveTab('shipments')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">{shipment.id}</p>
                          <p className="text-xs text-gray-500">{shipment.destination}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(shipment.cost)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {shipment.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'shipments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All Shipments</h3>
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Shipment history will be displayed here</p>
                <Link
                  to="/shipments/create"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-2"
                >
                  Create New Shipment
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Invoices</h3>
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="text-purple-600" size={16} />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-gray-900">{invoice.id}</p>
                        <p className="text-xs text-gray-500">{formatDate(invoice.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <TrendingUp size={16} className="text-gray-400" />
                  Total Spend
                </span>
                <span className="font-bold text-gray-900">{formatCurrency(currentCustomer.totalSpend)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  Credit Limit
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(currentCustomer.creditLimit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  Current Balance
                </span>
                <span className={`font-medium ${currentCustomer.currentBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formatCurrency(currentCustomer.currentBalance)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    Payment Terms
                  </span>
                  <span className="font-medium text-gray-900">{currentCustomer.paymentTerms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Shipments</span>
                <span className="font-bold text-gray-900">{currentCustomer.totalShipments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Shipment</span>
                <span className="text-gray-900 text-sm">
                  {currentCustomer.lastShipment ? formatDate(currentCustomer.lastShipment) : 'Never'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Since</span>
                <span className="text-gray-900 text-sm">{formatDate(currentCustomer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {currentCustomer.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-sm text-gray-600">{currentCustomer.notes}</p>
            </div>
          )}

          {/* Special Requirements */}
          {currentCustomer.specialRequirements && currentCustomer.specialRequirements.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Special Requirements
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentCustomer.specialRequirements.map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium capitalize">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
