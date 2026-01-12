import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrierStore } from './carrier.store';
import Loader from '../components/Loader';
import {
  Plus,
  Truck,
  User,
  Phone,
  Edit,
  Trash2,
  Building2,
  AlertCircle,
  Weight,
} from 'lucide-react';

/**
 * Vehicle List Page
 * Displays all vehicles with CRUD operations
 */
export default function VehicleList() {
  const {
    vehicles,
    carriers,
    isLoading,
    error,
    fetchVehicles,
    fetchCarriers,
    deleteVehicle,
  } = useCarrierStore();

  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [filterCarrier, setFilterCarrier] = useState('');

  useEffect(() => {
    fetchVehicles();
    fetchCarriers();
  }, [fetchVehicles, fetchCarriers]);

  const handleDelete = async (id) => {
    const result = await deleteVehicle(id);
    if (result.success) {
      setShowDeleteModal(null);
    }
  };

  const filteredVehicles = filterCarrier
    ? vehicles.filter((v) => v.carrierId === filterCarrier)
    : vehicles;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'in-use':
        return 'bg-blue-100 text-blue-700';
      case 'maintenance':
        return 'bg-amber-100 text-amber-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading && vehicles.length === 0) {
    return <Loader text="Loading vehicles..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage fleet vehicles and assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {/* Quick Links & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Link
          to="/carriers"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Building2 size={18} />
          ← Manage Carriers
        </Link>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by Carrier:</label>
          <select
            value={filterCarrier}
            onChange={(e) => setFilterCarrier(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">Add your first vehicle to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const carrier = carriers.find((c) => c.id === vehicle.carrierId);
            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Truck className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.plateNumber}</h3>
                      <p className="text-sm text-gray-500">{vehicle.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  {carrier && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 size={14} />
                      <span>{carrier.name}</span>
                    </div>
                  )}
                  {vehicle.capacity && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Weight size={14} />
                      <span>Capacity: {vehicle.capacity}</span>
                    </div>
                  )}
                  {vehicle.driverName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={14} />
                      <span>{vehicle.driverName}</span>
                    </div>
                  )}
                  {vehicle.driverPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{vehicle.driverPhone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => setShowEditModal(vehicle)}
                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(vehicle)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <VehicleFormModal
          carriers={carriers}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchVehicles();
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <VehicleFormModal
          vehicle={showEditModal}
          carriers={carriers}
          onClose={() => setShowEditModal(null)}
          onSuccess={() => {
            setShowEditModal(null);
            fetchVehicles();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Vehicle</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete vehicle <strong>{showDeleteModal.plateNumber}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Vehicle Form Modal Component
 */
function VehicleFormModal({ vehicle, carriers, onClose, onSuccess }) {
  const { createVehicle, updateVehicle, isLoading } = useCarrierStore();
  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    type: vehicle?.type || 'truck',
    capacity: vehicle?.capacity || '',
    carrierId: vehicle?.carrierId || '',
    driverName: vehicle?.driverName || '',
    driverPhone: vehicle?.driverPhone || '',
    status: vehicle?.status || 'available',
  });
  const [errors, setErrors] = useState({});

  const vehicleTypes = [
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'container', label: 'Container' },
    { value: 'pickup', label: 'Pickup' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in-use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.plateNumber.trim()) newErrors.plateNumber = 'Plate number is required';
    if (!formData.carrierId) newErrors.carrierId = 'Carrier is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = vehicle
      ? await updateVehicle(vehicle.id, formData)
      : await createVehicle(formData);

    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.plateNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABC-1234"
              />
              {errors.plateNumber && <p className="text-sm text-red-600 mt-1">{errors.plateNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carrier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.carrierId}
                onChange={(e) => setFormData({ ...formData, carrierId: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.carrierId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Carrier</option>
                {carriers.map((carrier) => (
                  <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                ))}
              </select>
              {errors.carrierId && <p className="text-sm text-red-600 mt-1">{errors.carrierId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="5 tons"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="John Driver"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Phone
              </label>
              <input
                type="tel"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : vehicle ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
