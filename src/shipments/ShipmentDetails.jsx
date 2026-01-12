import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShipmentStore } from './shipment.store';
import { useCarrierStore } from '../carriers/carrier.store';
import ShipmentTimeline from './ShipmentTimeline';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { SHIPMENT_STATUS } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/formatters';
import {
  ArrowLeft,
  Edit,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Calendar,
  Weight,
  Ruler,
  Hash,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

/**
 * Shipment Details Page
 * Displays full shipment information, timeline, and vehicle assignment
 */
export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentShipment,
    statusHistory,
    fetchShipmentById,
    fetchStatusHistory,
    updateShipmentStatus,
    assignVehicle,
    isLoading,
    error,
    clearCurrentShipment,
  } = useShipmentStore();

  const { vehicles, fetchVehicles } = useCarrierStore();

  const [isLoadingShipment, setIsLoadingShipment] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '', location: '' });
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingShipment(true);
      await Promise.all([
        fetchShipmentById(id),
        fetchStatusHistory(id),
        fetchVehicles(),
      ]);
      setIsLoadingShipment(false);
    };

    loadData();

    return () => clearCurrentShipment();
  }, [id, fetchShipmentById, fetchStatusHistory, fetchVehicles, clearCurrentShipment]);

  const handleStatusUpdate = async () => {
    if (!statusUpdate.status) return;

    const result = await updateShipmentStatus(id, statusUpdate);
    if (result.success) {
      setShowStatusModal(false);
      setStatusUpdate({ status: '', notes: '', location: '' });
    }
  };

  const handleVehicleAssign = async () => {
    if (!selectedVehicleId) return;

    const result = await assignVehicle(id, selectedVehicleId);
    if (result.success) {
      setShowVehicleModal(false);
      setSelectedVehicleId('');
    }
  };

  const getNextStatuses = () => {
    if (!currentShipment) return [];
    
    switch (currentShipment.status) {
      case SHIPMENT_STATUS.CREATED:
        return [SHIPMENT_STATUS.IN_TRANSIT];
      case SHIPMENT_STATUS.IN_TRANSIT:
        return [SHIPMENT_STATUS.DELIVERED];
      default:
        return [];
    }
  };

  if (isLoadingShipment) {
    return <Loader text="Loading shipment details..." />;
  }

  if (!currentShipment) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipment Not Found</h2>
        <p className="text-gray-500 mb-4">The shipment you're looking for doesn't exist.</p>
        <Link to="/shipments" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Shipments
        </Link>
      </div>
    );
  }

  const availableVehicles = vehicles.filter(
    (v) => v.status === 'available' || v.id === currentShipment.vehicle?.id
  );
  const nextStatuses = getNextStatuses();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/shipments"
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="font-mono">{currentShipment.orderId}</span>
              </h1>
              <StatusBadge status={currentShipment.status} />
            </div>
            <p className="text-gray-600 mt-1">
              {currentShipment.origin} → {currentShipment.destination}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nextStatuses.length > 0 && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              <RefreshCw size={18} />
              Update Status
            </button>
          )}
          <button
            onClick={() => navigate(`/shipments/${id}/edit`)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Edit size={18} />
            Edit
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sender Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-primary-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Sender</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{currentShipment.senderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="font-medium text-gray-900">{currentShipment.senderPhone}</p>
                </div>
              </div>
              {currentShipment.senderEmail && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">{currentShipment.senderEmail}</p>
                  </div>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Origin Address</p>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{currentShipment.origin}</p>
                    <p className="text-gray-600">{currentShipment.originAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Receiver</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{currentShipment.receiverName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="font-medium text-gray-900">{currentShipment.receiverPhone}</p>
                </div>
              </div>
              {currentShipment.receiverEmail && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">{currentShipment.receiverEmail}</p>
                  </div>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Destination Address</p>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{currentShipment.destination}</p>
                    <p className="text-gray-600">{currentShipment.destinationAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-amber-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Package Details</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium text-gray-900">{currentShipment.packageDescription}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Weight size={14} />
                  Weight
                </div>
                <p className="font-medium text-gray-900">{currentShipment.weight} kg</p>
              </div>
              {currentShipment.dimensions && (
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Ruler size={14} />
                    Dimensions
                  </div>
                  <p className="font-medium text-gray-900">{currentShipment.dimensions}</p>
                </div>
              )}
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Hash size={14} />
                  Quantity
                </div>
                <p className="font-medium text-gray-900">{currentShipment.quantity}</p>
              </div>
            </div>

            {currentShipment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-700 mt-1">{currentShipment.notes}</p>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipment Timeline</h2>
            <ShipmentTimeline history={statusHistory} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={currentShipment.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Priority</span>
                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                  currentShipment.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  currentShipment.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentShipment.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{formatDate(currentShipment.createdAt)}</span>
              </div>
              {currentShipment.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="text-gray-900">{formatDateTime(currentShipment.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Vehicle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Assigned Vehicle</h3>
              <button
                onClick={() => setShowVehicleModal(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {currentShipment.vehicle ? 'Change' : 'Assign'}
              </button>
            </div>
            
            {currentShipment.vehicle ? (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {currentShipment.vehicle.plateNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentShipment.vehicle.type} • {currentShipment.vehicle.capacity}
                  </p>
                  {currentShipment.vehicle.driverName && (
                    <p className="text-sm text-gray-500 mt-1">
                      Driver: {currentShipment.vehicle.driverName}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No vehicle assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Shipment Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select status</option>
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={statusUpdate.location}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Current location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!statusUpdate.status || isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Assignment Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Vehicle</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Vehicle
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a vehicle</option>
                {availableVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.type} ({vehicle.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowVehicleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVehicleAssign}
                disabled={!selectedVehicleId || isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Truck size={18} />
                    Assign Vehicle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
