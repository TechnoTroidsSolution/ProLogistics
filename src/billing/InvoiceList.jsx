import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBillingStore } from './billing.store';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  TrendingUp,
  CreditCard,
  Receipt,
  Mail,
} from 'lucide-react';

/**
 * Invoice List Page
 * Displays all invoices with filtering and management options
 */
export default function InvoiceList() {
  const { invoices, stats, isLoading, fetchInvoices, sendInvoice, deleteInvoice } = useBillingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchInvoices({ status: statusFilter, search: searchTerm });
  }, [fetchInvoices, statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-amber-100 text-amber-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-500',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  const handleSendInvoice = async (id) => {
    await sendInvoice(id);
    setShowActions(null);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(id);
    }
    setShowActions(null);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'green',
      subtitle: 'All time',
    },
    {
      title: 'Pending',
      value: formatCurrency(stats.pendingAmount),
      icon: Clock,
      color: 'amber',
      subtitle: `${invoices.filter(i => i.status === 'pending').length} invoices`,
    },
    {
      title: 'Overdue',
      value: formatCurrency(stats.overdueAmount),
      icon: AlertTriangle,
      color: 'red',
      subtitle: `${invoices.filter(i => i.status === 'overdue').length} invoices`,
    },
    {
      title: 'Paid This Month',
      value: formatCurrency(stats.paidThisMonth),
      icon: CheckCircle,
      color: 'blue',
      subtitle: 'January 2026',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage billing and payments</p>
        </div>
        <Link
          to="/billing/invoices/create"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Invoice
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
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'amber' ? 'bg-amber-100' :
                  stat.color === 'red' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <Icon className={`${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    'text-blue-600'
                  }`} size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
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
              placeholder="Search by invoice ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            {['all', 'draft', 'pending', 'paid', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status === 'all' ? '' : status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  (status === 'all' && !statusFilter) || statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-4">Create your first invoice to get started</p>
            <Link
              to="/billing/invoices/create"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus size={18} />
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="font-mono font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-gray-500">{invoice.items.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {formatDate(invoice.dueDate)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <Link
                          to={`/billing/invoices/${invoice.id}`}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === invoice.id ? null : invoice.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {showActions === invoice.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {invoice.status === 'draft' && (
                                <button
                                  onClick={() => handleSendInvoice(invoice.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Send size={16} />
                                  Send Invoice
                                </button>
                              )}
                              {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                <Link
                                  to={`/billing/invoices/${invoice.id}/payment`}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <CreditCard size={16} />
                                  Record Payment
                                </Link>
                              )}
                              <button
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <AlertTriangle size={16} />
                                Delete Invoice
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
