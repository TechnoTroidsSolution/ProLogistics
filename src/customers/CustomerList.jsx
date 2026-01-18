import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerStore } from './customer.store';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Filter,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

/**
 * Customer List Page
 * Displays all customers with filtering and management
 */
export default function CustomerList() {
  const { customers, stats, isLoading, fetchCustomers, updateCustomerStatus, deleteCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchCustomers({ status: statusFilter, type: typeFilter, search: searchTerm });
  }, [fetchCustomers, statusFilter, typeFilter, searchTerm]);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      suspended: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.inactive}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'business' ? Building : User;
  };

  const handleToggleStatus = async (customer) => {
    const newStatus = customer.status === 'active' ? 'inactive' : 'active';
    await updateCustomerStatus(customer.id, newStatus);
    setShowActions(null);
    fetchCustomers({ status: statusFilter, type: typeFilter, search: searchTerm });
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
    setShowActions(null);
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Avg. Spend',
      value: formatCurrency(stats.averageSpend),
      icon: TrendingUp,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Link
          to="/customers/create"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Customer
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-amber-100'
                }`}>
                  <Icon className={`${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-amber-600'
                  }`} size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="business">Business</option>
              <option value="individual">Individual</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">Add your first customer to get started</p>
            <Link
              to="/customers/create"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus size={18} />
              Add Customer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shipments</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Spend</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => {
                  const TypeIcon = getTypeIcon(customer.type);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${customer.type === 'business' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                            <TypeIcon className={customer.type === 'business' ? 'text-blue-600' : 'text-purple-600'} size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-900 flex items-center gap-1.5">
                            <Mail size={14} className="text-gray-400" />
                            {customer.email}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-400" />
                            {customer.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{customer.totalShipments}</span>
                        </div>
                        {customer.lastShipment && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last: {formatDate(customer.lastShipment)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpend)}</p>
                        {customer.currentBalance > 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            Balance: {formatCurrency(customer.currentBalance)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Customer"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Customer"
                          >
                            <Edit size={18} />
                          </Link>
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === customer.id ? null : customer.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {showActions === customer.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleToggleStatus(customer)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  {customer.status === 'active' ? (
                                    <>
                                      <XCircle size={16} />
                                      Mark Inactive
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={16} />
                                      Mark Active
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <XCircle size={16} />
                                  Delete Customer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
