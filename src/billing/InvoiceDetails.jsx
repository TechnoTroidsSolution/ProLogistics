import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBillingStore } from './billing.store';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  ArrowLeft,
  Download,
  Send,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Calendar,
  Package,
  Truck,
  X,
} from 'lucide-react';

/**
 * Invoice Details Page
 * Displays full invoice with payment recording capability
 */
export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentInvoice, payments, isLoading, fetchInvoiceById, recordPayment, sendInvoice } = useBillingStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'credit_card',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    fetchInvoiceById(id);
  }, [id, fetchInvoiceById]);

  const getStatusIcon = (status) => {
    const icons = {
      draft: Clock,
      pending: Clock,
      paid: CheckCircle,
      overdue: AlertTriangle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      pending: 'amber',
      paid: 'green',
      overdue: 'red',
    };
    return colors[status] || 'gray';
  };

  const handleRecordPayment = async () => {
    await recordPayment(id, {
      ...paymentData,
      amount: parseFloat(paymentData.amount),
    });
    setShowPaymentModal(false);
    setPaymentData({ amount: '', method: 'credit_card', reference: '', notes: '' });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !currentInvoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(currentInvoice.status);
  const statusColor = getStatusColor(currentInvoice.status);
  const invoicePayments = payments.filter(p => p.invoiceId === id);
  const amountPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = currentInvoice.total - amountPaid;

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
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{currentInvoice.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1.5 ${
                statusColor === 'green' ? 'bg-green-100 text-green-700' :
                statusColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                statusColor === 'red' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <StatusIcon size={14} />
                {currentInvoice.status}
              </span>
            </div>
            <p className="text-gray-600">Created {formatDate(currentInvoice.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentInvoice.status === 'draft' && (
            <button
              onClick={() => sendInvoice(id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <Send size={18} />
              Send Invoice
            </button>
          )}
          {(currentInvoice.status === 'pending' || currentInvoice.status === 'overdue') && (
            <button
              onClick={() => {
                setPaymentData({ ...paymentData, amount: balanceDue.toString() });
                setShowPaymentModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <CreditCard size={18} />
              Record Payment
            </button>
          )}
          <button
            onClick={handlePrint}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Print"
          >
            <Printer size={18} />
          </button>
          <button
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Document */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-none">
            {/* Company Header */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Truck className="text-primary-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">LogiTrack</h2>
                </div>
                <p className="text-sm text-gray-600">123 Logistics Way</p>
                <p className="text-sm text-gray-600">San Francisco, CA 94102</p>
                <p className="text-sm text-gray-600">billing@logitrack.com</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">INVOICE</p>
                <p className="text-lg font-mono text-gray-600 mt-2">{currentInvoice.id}</p>
              </div>
            </div>

            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
                <p className="font-semibold text-gray-900">{currentInvoice.customerName}</p>
                <p className="text-sm text-gray-600">{currentInvoice.customerEmail}</p>
                <p className="text-sm text-gray-600">{currentInvoice.customerAddress || '456 Customer St, Los Angeles, CA'}</p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Invoice Date</p>
                    <p className="font-medium text-gray-900">{formatDate(currentInvoice.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className={`font-medium ${currentInvoice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(currentInvoice.dueDate)}
                    </p>
                  </div>
                  {currentInvoice.shipmentId && (
                    <div>
                      <p className="text-xs text-gray-500">Shipment</p>
                      <Link to={`/shipments/${currentInvoice.shipmentId}`} className="font-medium text-primary-600 hover:text-primary-700">
                        {currentInvoice.shipmentId}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                    <th className="py-3 text-right text-sm font-semibold text-gray-700">Rate</th>
                    <th className="py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4">
                        <p className="font-medium text-gray-900">{item.description}</p>
                        {item.details && <p className="text-sm text-gray-500">{item.details}</p>}
                      </td>
                      <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                      <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(currentInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({(currentInvoice.taxRate || 0) * 100}%)</span>
                    <span className="text-gray-900">{formatCurrency(currentInvoice.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(currentInvoice.total)}</span>
                  </div>
                  {amountPaid > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Amount Paid</span>
                        <span>-{formatCurrency(amountPaid)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Balance Due</span>
                        <span className={balanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(balanceDue)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {currentInvoice.notes && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{currentInvoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Invoice Total</span>
                <span className="font-semibold text-gray-900">{formatCurrency(currentInvoice.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-green-600">{formatCurrency(amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-900">Balance Due</span>
                <span className={`font-bold text-lg ${balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
            {invoicePayments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No payments recorded</p>
            ) : (
              <div className="space-y-3">
                {invoicePayments.map((payment) => (
                  <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                        {payment.method.replace('_', ' ')}
                      </span>
                    </div>
                    {payment.reference && (
                      <p className="text-xs text-gray-500 mt-1">Ref: {payment.reference}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Invoice created</p>
                  <p className="text-xs text-gray-500">{formatDate(currentInvoice.createdAt)}</p>
                </div>
              </div>
              {currentInvoice.sentAt && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <Send size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Invoice sent</p>
                    <p className="text-xs text-gray-500">{formatDate(currentInvoice.sentAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Transaction ID or Check #"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!paymentData.amount || parseFloat(paymentData.amount) <= 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
