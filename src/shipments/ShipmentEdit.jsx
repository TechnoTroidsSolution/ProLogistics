import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShipmentStore } from './shipment.store';
import Loader from '../components/Loader';
import { ArrowLeft, Save, Package, MapPin, User, Phone, Mail, FileText } from 'lucide-react';

/**
 * Shipment Edit Page
 * Form for editing existing shipments
 */
export default function ShipmentEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    currentShipment, 
    fetchShipmentById, 
    updateShipment, 
    isLoading, 
    error,
    clearCurrentShipment 
  } = useShipmentStore();

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    origin: '',
    originAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    destination: '',
    destinationAddress: '',
    packageDescription: '',
    weight: '',
    dimensions: '',
    quantity: 1,
    notes: '',
    priority: 'normal',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingShipment, setIsLoadingShipment] = useState(true);

  useEffect(() => {
    const loadShipment = async () => {
      setIsLoadingShipment(true);
      await fetchShipmentById(id);
      setIsLoadingShipment(false);
    };
    
    loadShipment();

    return () => clearCurrentShipment();
  }, [id, fetchShipmentById, clearCurrentShipment]);

  useEffect(() => {
    if (currentShipment) {
      setFormData({
        senderName: currentShipment.senderName || '',
        senderPhone: currentShipment.senderPhone || '',
        senderEmail: currentShipment.senderEmail || '',
        origin: currentShipment.origin || '',
        originAddress: currentShipment.originAddress || '',
        receiverName: currentShipment.receiverName || '',
        receiverPhone: currentShipment.receiverPhone || '',
        receiverEmail: currentShipment.receiverEmail || '',
        destination: currentShipment.destination || '',
        destinationAddress: currentShipment.destinationAddress || '',
        packageDescription: currentShipment.packageDescription || '',
        weight: currentShipment.weight?.toString() || '',
        dimensions: currentShipment.dimensions || '',
        quantity: currentShipment.quantity || 1,
        notes: currentShipment.notes || '',
        priority: currentShipment.priority || 'normal',
      });
    }
  }, [currentShipment]);

  const validateForm = () => {
    const errors = {};

    if (!formData.senderName.trim()) errors.senderName = 'Sender name is required';
    if (!formData.senderPhone.trim()) errors.senderPhone = 'Sender phone is required';
    if (!formData.origin.trim()) errors.origin = 'Origin city is required';
    if (!formData.originAddress.trim()) errors.originAddress = 'Origin address is required';
    
    if (!formData.receiverName.trim()) errors.receiverName = 'Receiver name is required';
    if (!formData.receiverPhone.trim()) errors.receiverPhone = 'Receiver phone is required';
    if (!formData.destination.trim()) errors.destination = 'Destination city is required';
    if (!formData.destinationAddress.trim()) errors.destinationAddress = 'Destination address is required';
    
    if (!formData.packageDescription.trim()) errors.packageDescription = 'Package description is required';
    if (!formData.weight || parseFloat(formData.weight) <= 0) errors.weight = 'Valid weight is required';
    if (formData.quantity < 1) errors.quantity = 'Quantity must be at least 1';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.senderEmail && !emailRegex.test(formData.senderEmail)) {
      errors.senderEmail = 'Invalid email format';
    }
    if (formData.receiverEmail && !emailRegex.test(formData.receiverEmail)) {
      errors.receiverEmail = 'Invalid email format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await updateShipment(id, {
      ...formData,
      weight: parseFloat(formData.weight),
      quantity: parseInt(formData.quantity, 10),
    });

    if (result.success) {
      navigate(`/shipments/${id}`);
    }
  };

  const inputClasses = (fieldName) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
      validationErrors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  if (isLoadingShipment) {
    return <Loader text="Loading shipment..." />;
  }

  if (!currentShipment && !isLoadingShipment) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/shipments/${id}`}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Shipment</h1>
          <p className="text-gray-600">
            Order ID: <span className="font-mono">{currentShipment?.orderId}</span>
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-primary-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Sender Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                className={inputClasses('senderName')}
              />
              {validationErrors.senderName && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.senderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleChange}
                  className={`${inputClasses('senderPhone')} pl-10`}
                />
              </div>
              {validationErrors.senderPhone && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.senderPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  className={`${inputClasses('senderEmail')} pl-10`}
                />
              </div>
              {validationErrors.senderEmail && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.senderEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className={`${inputClasses('origin')} pl-10`}
                />
              </div>
              {validationErrors.origin && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.origin}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="originAddress"
                value={formData.originAddress}
                onChange={handleChange}
                rows={2}
                className={inputClasses('originAddress')}
              />
              {validationErrors.originAddress && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.originAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Receiver Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                className={inputClasses('receiverName')}
              />
              {validationErrors.receiverName && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.receiverName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className={`${inputClasses('receiverPhone')} pl-10`}
                />
              </div>
              {validationErrors.receiverPhone && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.receiverPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  className={`${inputClasses('receiverEmail')} pl-10`}
                />
              </div>
              {validationErrors.receiverEmail && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.receiverEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className={`${inputClasses('destination')} pl-10`}
                />
              </div>
              {validationErrors.destination && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.destination}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                rows={2}
                className={inputClasses('destinationAddress')}
              />
              {validationErrors.destinationAddress && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.destinationAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-amber-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Package Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="packageDescription"
                value={formData.packageDescription}
                onChange={handleChange}
                className={inputClasses('packageDescription')}
              />
              {validationErrors.packageDescription && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.packageDescription}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                className={inputClasses('weight')}
              />
              {validationErrors.weight && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Dimensions (L x W x H cm)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className={inputClasses('dimensions')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={inputClasses('quantity')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={inputClasses('priority')}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
          </div>
          
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={inputClasses('notes')}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to={`/shipments/${id}`}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
