import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShipmentStore } from './shipment.store';
import { useInventoryStore } from '../inventory/inventory.store';
import { SHIPMENT_STATUS } from '../utils/constants';
import { ArrowLeft, Save, Package, MapPin, User, Phone, Mail, FileText, Plus, Trash2, Box, Search, X, ShoppingCart, DollarSign, Truck, Clock, RefreshCw, Star, Layers, Filter, CreditCard, Building2 } from 'lucide-react';
import { calculateRates, CARRIERS_DATA } from '../data/ratesData';

/**
 * Shipment Create Page
 * Form for creating new shipments
 */
export default function ShipmentCreate() {
  const navigate = useNavigate();
  const { createShipment, isLoading, error } = useShipmentStore();
  const { items: inventoryItems, fetchInventory } = useInventoryStore();

  // Rates state
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');
  
  // Rate mode: 'all' = Shop Rates (all carriers), 'single' = Rate Current (single carrier)
  const [rateMode, setRateMode] = useState('all');
  const [selectedCarrierId, setSelectedCarrierId] = useState('');
  
  // Single Carrier Account Details
  const [carrierAccount, setCarrierAccount] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('shipper'); // shipper, receiver, third_party
  const [thirdPartyAccount, setThirdPartyAccount] = useState('');
  
  // Demo carrier accounts (later from database)
  const CARRIER_ACCOUNTS = {
    'CAR-001': [{ id: 'ACC-FF-001', number: 'FF-789456123', name: 'FastFreight Main Account' }, { id: 'ACC-FF-002', number: 'FF-321654987', name: 'FastFreight Secondary' }],
    'CAR-002': [{ id: 'ACC-TG-001', number: 'TG-456789123', name: 'TransGlobal Primary' }],
    'CAR-003': [{ id: 'ACC-MH-001', number: 'MH-987654321', name: 'Metro Haulers Corporate' }, { id: 'ACC-MH-002', number: 'MH-123456789', name: 'Metro Haulers Regional' }],
    'CAR-004': [{ id: 'ACC-QS-001', number: 'QS-741852963', name: 'QuickShip Enterprise' }],
    'CAR-005': [{ id: 'ACC-UF-001', number: 'UF-369258147', name: 'United Freight Standard' }],
    'CAR-006': [{ id: 'ACC-PL-001', number: 'PL-852963741', name: 'Prime Logistics Premium' }, { id: 'ACC-PL-002', number: 'PL-147258369', name: 'Prime Logistics Basic' }],
  };

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

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

  // Items in the package
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    quantity: 1,
    unitPrice: '',
    weight: '',
    category: 'general',
  });
  const [showInventoryPicker, setShowInventoryPicker] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.senderName.trim()) errors.senderName = 'Required';
    if (!formData.senderPhone.trim()) errors.senderPhone = 'Required';
    if (!formData.origin.trim()) errors.origin = 'Required';
    if (!formData.originAddress.trim()) errors.originAddress = 'Required';
    if (!formData.receiverName.trim()) errors.receiverName = 'Required';
    if (!formData.receiverPhone.trim()) errors.receiverPhone = 'Required';
    if (!formData.destination.trim()) errors.destination = 'Required';
    if (!formData.destinationAddress.trim()) errors.destinationAddress = 'Required';
    if (!formData.packageDescription.trim()) errors.packageDescription = 'Required';
    if (!formData.weight || parseFloat(formData.weight) <= 0) errors.weight = 'Required';
    if (formData.quantity < 1) errors.quantity = 'Min 1';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.senderEmail && !emailRegex.test(formData.senderEmail)) {
      errors.senderEmail = 'Invalid email';
    }
    if (formData.receiverEmail && !emailRegex.test(formData.receiverEmail)) {
      errors.receiverEmail = 'Invalid email';
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

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    
    const item = {
      ...newItem,
      id: `ITEM-${Date.now()}`,
      quantity: parseInt(newItem.quantity, 10) || 1,
      unitPrice: parseFloat(newItem.unitPrice) || 0,
      weight: parseFloat(newItem.weight) || 0,
    };
    
    setItems((prev) => [...prev, item]);
    setNewItem({
      name: '',
      sku: '',
      quantity: 1,
      unitPrice: '',
      weight: '',
      category: 'general',
    });
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Add item from inventory
  const addFromInventory = (inventoryItem) => {
    const existingItem = items.find(item => item.inventoryId === inventoryItem.id);
    
    if (existingItem) {
      // Increase quantity if already added
      setItems((prev) => prev.map(item => 
        item.inventoryId === inventoryItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const item = {
        id: `ITEM-${Date.now()}`,
        inventoryId: inventoryItem.id,
        name: inventoryItem.name,
        sku: inventoryItem.sku,
        quantity: 1,
        unitPrice: inventoryItem.unitPrice,
        weight: inventoryItem.weight,
        category: inventoryItem.category,
        fromInventory: true,
      };
      setItems((prev) => [...prev, item]);
    }
  };

  // Filter inventory items based on search
  const filteredInventory = inventoryItems.filter(item => {
    if (!inventorySearch) return true;
    const search = inventorySearch.toLowerCase();
    return item.name.toLowerCase().includes(search) ||
           item.sku.toLowerCase().includes(search) ||
           item.category.toLowerCase().includes(search);
  });

  const getTotalItemsWeight = () => {
    return items.reduce((sum, item) => sum + (item.weight * item.quantity), 0).toFixed(2);
  };

  const getTotalItemsValue = () => {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2);
  };

  // Check if form has enough data to fetch rates
  const canFetchRates = () => {
    const hasBasicInfo = formData.origin.trim() && 
           formData.destination.trim() && 
           formData.weight && 
           Number.parseFloat(formData.weight) > 0;
    
    // In single carrier mode, also need a carrier and account selected
    if (rateMode === 'single') {
      const hasCarrierInfo = selectedCarrierId && carrierAccount;
      const hasPaymentInfo = paymentTerms !== 'third_party' || thirdPartyAccount.trim();
      return hasBasicInfo && hasCarrierInfo && hasPaymentInfo;
    }
    
    return hasBasicInfo;
  };

  // Fetch shipping rates from carriers using rates data file
  const fetchRates = async () => {
    if (!canFetchRates()) {
      if (rateMode === 'single') {
        if (!selectedCarrierId) {
          setRatesError('Please select a carrier');
        } else if (!carrierAccount) {
          setRatesError('Please select an account number');
        } else if (paymentTerms === 'third_party' && !thirdPartyAccount.trim()) {
          setRatesError('Please enter third party account number');
        } else {
          setRatesError('Please fill in Origin, Destination, and Weight');
        }
      } else {
        setRatesError('Please fill in Origin, Destination, and Weight to get rates');
      }
      return;
    }

    setFetchingRates(true);
    setRatesError('');
    setRates([]);
    setSelectedRate(null);

    // Simulate API call delay (will be replaced with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Get rates from the data file
      const calculatedRates = calculateRates({
        origin: formData.origin,
        destination: formData.destination,
        weight: formData.weight,
        priority: formData.priority,
        carrierId: rateMode === 'single' ? selectedCarrierId : null,
        accountNumber: rateMode === 'single' ? carrierAccount : null,
        paymentTerms: rateMode === 'single' ? paymentTerms : 'shipper',
      });

      setRates(calculatedRates);
    } catch (err) {
      setRatesError('Failed to fetch rates. Please try again.');
    }

    setFetchingRates(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await createShipment({
      ...formData,
      items,
      status: SHIPMENT_STATUS.CREATED,
      weight: parseFloat(formData.weight),
      quantity: parseInt(formData.quantity, 10),
    });

    if (result.success) {
      navigate('/shipments');
    }
  };

  const inputClasses = (fieldName) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
      validationErrors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/shipments"
            className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Shipment</h1>
        </div>
        <button
          type="submit"
          form="shipment-form"
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save size={16} />
              Create Shipment
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form id="shipment-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sender Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <User className="text-primary-600" size={18} />
              <h2 className="font-semibold text-gray-900">Sender</h2>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    className={inputClasses('senderName')}
                    placeholder="John Doe"
                  />
                  {validationErrors.senderName && <p className="text-xs text-red-600 mt-0.5">{validationErrors.senderName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleChange}
                      className={`${inputClasses('senderPhone')} pl-8`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {validationErrors.senderPhone && <p className="text-xs text-red-600 mt-0.5">{validationErrors.senderPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      className={`${inputClasses('senderEmail')} pl-8`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className={`${inputClasses('origin')} pl-8`}
                      placeholder="New York"
                    />
                  </div>
                  {validationErrors.origin && <p className="text-xs text-red-600 mt-0.5">{validationErrors.origin}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address *</label>
                <textarea
                  name="originAddress"
                  value={formData.originAddress}
                  onChange={handleChange}
                  rows={2}
                  className={inputClasses('originAddress')}
                  placeholder="123 Main Street, Suite 100, NY 10001"
                />
                {validationErrors.originAddress && <p className="text-xs text-red-600 mt-0.5">{validationErrors.originAddress}</p>}
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <User className="text-green-600" size={18} />
              <h2 className="font-semibold text-gray-900">Receiver</h2>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className={inputClasses('receiverName')}
                    placeholder="Jane Smith"
                  />
                  {validationErrors.receiverName && <p className="text-xs text-red-600 mt-0.5">{validationErrors.receiverName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="tel"
                      name="receiverPhone"
                      value={formData.receiverPhone}
                      onChange={handleChange}
                      className={`${inputClasses('receiverPhone')} pl-8`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {validationErrors.receiverPhone && <p className="text-xs text-red-600 mt-0.5">{validationErrors.receiverPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="email"
                      name="receiverEmail"
                      value={formData.receiverEmail}
                      onChange={handleChange}
                      className={`${inputClasses('receiverEmail')} pl-8`}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className={`${inputClasses('destination')} pl-8`}
                      placeholder="Los Angeles"
                    />
                  </div>
                  {validationErrors.destination && <p className="text-xs text-red-600 mt-0.5">{validationErrors.destination}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address *</label>
                <textarea
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  rows={2}
                  className={inputClasses('destinationAddress')}
                  placeholder="456 Oak Avenue, Apt 200, LA 90001"
                />
                {validationErrors.destinationAddress && <p className="text-xs text-red-600 mt-0.5">{validationErrors.destinationAddress}</p>}
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <Package className="text-amber-600" size={18} />
              <h2 className="font-semibold text-gray-900">Package Details</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                <input
                  type="text"
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleChange}
                  className={inputClasses('packageDescription')}
                  placeholder="Electronics, Fragile Items, Documents, etc."
                />
                {validationErrors.packageDescription && <p className="text-xs text-red-600 mt-0.5">{validationErrors.packageDescription}</p>}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    min="0.1"
                    className={inputClasses('weight')}
                    placeholder="2.5"
                  />
                  {validationErrors.weight && <p className="text-xs text-red-600 mt-0.5">{validationErrors.weight}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className={inputClasses('dimensions')}
                    placeholder="30x20x15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Packages</label>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
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
          </div>

          {/* Package Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Box className="text-blue-600" size={18} />
                <h2 className="font-semibold text-gray-900">Package Items</h2>
                <span className="text-xs text-gray-500">({items.length} items)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInventoryPicker(!showInventoryPicker)}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 ${
                  showInventoryPicker 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ShoppingCart size={14} />
                {showInventoryPicker ? 'Hide Inventory' : 'From Inventory'}
              </button>
            </div>

            {/* Inventory Picker */}
            {showInventoryPicker && (
              <div className="mb-3 border border-blue-200 rounded-lg bg-blue-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Select from Inventory</span>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Search items..."
                      className="pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg w-48 focus:ring-2 focus:ring-primary-500"
                    />
                    {inventorySearch && (
                      <button
                        type="button"
                        onClick={() => setInventorySearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {filteredInventory.slice(0, 10).map((invItem) => {
                    const isAdded = items.some(item => item.inventoryId === invItem.id);
                    return (
                      <button
                        key={invItem.id}
                        type="button"
                        onClick={() => addFromInventory(invItem)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                          isAdded 
                            ? 'bg-green-100 border border-green-300' 
                            : 'bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{invItem.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{invItem.sku}</span>
                            <span>•</span>
                            <span>${invItem.unitPrice}</span>
                            <span>•</span>
                            <span className="text-green-600">{invItem.stock} in stock</span>
                          </div>
                        </div>
                        {isAdded ? (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Added</span>
                        ) : (
                          <Plus size={16} className="text-primary-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {filteredInventory.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-3">No items found</p>
                )}
                {filteredInventory.length > 10 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Showing 10 of {filteredInventory.length} items. Search to find more.
                  </p>
                )}
              </div>
            )}

            {/* Summary Bar */}
            {items.length > 0 && (
              <div className="flex gap-4 mb-3 p-2 bg-gray-50 rounded-lg text-xs">
                <span className="text-gray-500">Items: <span className="font-medium text-gray-700">{items.reduce((sum, i) => sum + i.quantity, 0)}</span></span>
                <span className="text-gray-500">Weight: <span className="font-medium text-gray-700">{getTotalItemsWeight()} kg</span></span>
                <span className="text-gray-500">Value: <span className="font-medium text-green-600">${getTotalItemsValue()}</span></span>
              </div>
            )}
            
            {/* Manual Add Item Form */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Or add custom item:</p>
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleItemChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Item Name *"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="sku"
                    value={newItem.sku}
                    onChange={handleItemChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleItemChange}
                    min="1"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="unitPrice"
                    value={newItem.unitPrice}
                    onChange={handleItemChange}
                    step="0.01"
                    min="0"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Price ($)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="weight"
                    value={newItem.weight}
                    onChange={handleItemChange}
                    step="0.1"
                    min="0"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Weight (kg)"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleItemChange}
                  className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General</option>
                  <option value="electronics">Electronics</option>
                  <option value="fragile">Fragile</option>
                  <option value="perishable">Perishable</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="documents">Documents</option>
                  <option value="clothing">Clothing</option>
                  <option value="furniture">Furniture</option>
                </select>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!newItem.name.trim()}
                  className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Custom
                </button>
              </div>
            </div>

            {/* Items List */}
            {items.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                <Box className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No items added yet. Select from inventory or add custom items.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      item.fromInventory 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        item.fromInventory 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.fromInventory && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Inventory</span>
                          )}
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500">
                          {item.sku && <span>SKU: {item.sku}</span>}
                          <span>Qty: {item.quantity}</span>
                          {item.weight > 0 && <span>• {item.weight} kg</span>}
                          <span className="capitalize">• {item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.unitPrice > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <FileText className="text-gray-600" size={18} />
              <h2 className="font-semibold text-gray-900">Notes</h2>
            </div>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={inputClasses('notes')}
              placeholder="Special handling instructions, delivery preferences, etc."
            />
          </div>

          {/* Fetch Rates Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="text-green-600" size={18} />
                <h2 className="font-semibold text-gray-900">Shipping Rates</h2>
              </div>
              <button
                type="button"
                onClick={fetchRates}
                disabled={fetchingRates || !canFetchRates()}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                  canFetchRates()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {fetchingRates ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Fetching Rates...
                  </>
                ) : (
                  <>
                    <DollarSign size={16} />
                    Fetch Rates
                  </>
                )}
              </button>
            </div>

            {/* Rate Mode Selector */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Mode Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setRateMode('all');
                      setRates([]);
                      setSelectedRate(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      rateMode === 'all'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers size={16} />
                    <span>Shop Rates</span>
                    <span className="text-xs text-gray-400">(All Carriers)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRateMode('single');
                      setRates([]);
                      setSelectedRate(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      rateMode === 'single'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Filter size={16} />
                    <span>Single Carrier</span>
                  </button>
                </div>

                {/* Carrier Selector (only shown in single mode) */}
                {rateMode === 'single' && (
                  <div className="flex-1">
                    <select
                      value={selectedCarrierId}
                      onChange={(e) => {
                        setSelectedCarrierId(e.target.value);
                        setCarrierAccount('');
                        setRates([]);
                        setSelectedRate(null);
                      }}
                      className="w-full px-4 py-2.5 text-sm bg-white border-2 border-blue-200 rounded-xl shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10 font-medium text-gray-700"
                    >
                      <option value="">🚚 Select a Carrier</option>
                      {CARRIERS_DATA.map((carrier) => (
                        <option key={carrier.id} value={carrier.id}>
                          {carrier.name} (★ {carrier.rating})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Mode Description */}
              <p className="text-xs text-gray-500 mt-2">
                {rateMode === 'all' 
                  ? '📦 Compare rates from all available carriers to find the best option for your shipment.'
                  : '🎯 Get specific rates from your preferred carrier using your negotiated account pricing.'}
              </p>
            </div>

            {/* Single Carrier Account Details Section */}
            {rateMode === 'single' && selectedCarrierId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Carrier Account Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Carrier Info */}
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">Selected Carrier</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.color }}
                      >
                        {CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ★ {CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.rating} Rating
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Selection */}
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Account Number</label>
                    <select
                      value={carrierAccount}
                      onChange={(e) => setCarrierAccount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_10px_center] bg-no-repeat pr-9 font-medium text-gray-700"
                    >
                      <option value="">Select Account</option>
                      {(CARRIER_ACCOUNTS[selectedCarrierId] || []).map((acc) => (
                        <option key={acc.id} value={acc.number}>
                          {acc.number} - {acc.name}
                        </option>
                      ))}
                    </select>
                    {carrierAccount && (
                      <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">✓ Account selected</p>
                    )}
                  </div>

                  {/* Payment Terms */}
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Payment Terms (Bill To)</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_10px_center] bg-no-repeat pr-9 font-medium text-gray-700"
                    >
                      <option value="shipper">💳 Shipper (Prepaid)</option>
                      <option value="receiver">📦 Receiver (Collect)</option>
                      <option value="third_party">🏢 Third Party</option>
                    </select>
                  </div>
                </div>

                {/* Third Party Account Input */}
                {paymentTerms === 'third_party' && (
                  <div className="mt-3">
                    <label className="text-xs text-gray-500 mb-1 block">Third Party Account Number</label>
                    <input
                      type="text"
                      value={thirdPartyAccount}
                      onChange={(e) => setThirdPartyAccount(e.target.value)}
                      placeholder="Enter third party account number"
                      className="w-full md:w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Payment Summary */}
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-blue-600" />
                    <p className="text-xs text-blue-800">
                      <strong>Billing:</strong> {' '}
                      {paymentTerms === 'shipper' && 'Charges will be billed to the shipper (you)'}
                      {paymentTerms === 'receiver' && 'Charges will be billed to the receiver upon delivery'}
                      {paymentTerms === 'third_party' && (thirdPartyAccount 
                        ? `Charges will be billed to third party account: ${thirdPartyAccount}`
                        : 'Please enter the third party account number')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rate Requirements Hint */}
            {!canFetchRates() && rates.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-amber-700">
                  <strong>Required for rates:</strong> Origin city, Destination city, Package weight
                  {rateMode === 'single' && (
                    <span>
                      {!selectedCarrierId && ', Carrier selection'}
                      {selectedCarrierId && !carrierAccount && ', Account number'}
                      {paymentTerms === 'third_party' && !thirdPartyAccount && ', Third party account'}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Error Message */}
            {ratesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-red-700">{ratesError}</p>
              </div>
            )}

            {/* Loading State */}
            {fetchingRates && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <RefreshCw size={32} className="animate-spin text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {rateMode === 'all' 
                      ? 'Fetching best rates from all carriers...'
                      : `Fetching rates from ${CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.name || 'carrier'}...`}
                  </p>
                </div>
              </div>
            )}

            {/* Rates List */}
            {!fetchingRates && rates.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {rateMode === 'single' && (
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.color }}
                      />
                    )}
                    <p className="text-sm text-gray-500">
                      {rateMode === 'all' 
                        ? `Found ${rates.length} shipping options from ${new Set(rates.map(r => r.carrierName)).size} carriers`
                        : `${rates.length} service options from ${rates[0]?.carrierName}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Route: {formData.origin} → {formData.destination}
                  </p>
                </div>
                
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gray-100 rounded-t-lg text-xs font-semibold text-gray-600 uppercase">
                  <div className="col-span-4">Carrier / Service</div>
                  <div className="col-span-2 text-center">Delivery</div>
                  <div className="col-span-1 text-center">Rating</div>
                  <div className="col-span-3">Features</div>
                  <div className="col-span-2 text-right">Price</div>
                </div>
                
                {/* List View */}
                <div className="border border-gray-200 rounded-lg md:rounded-t-none overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                    {rates.map((rate, index) => (
                      <div
                        key={rate.id}
                        onClick={() => setSelectedRate(rate)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedRate(rate)}
                        tabIndex={0}
                        role="button"
                        className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-4 cursor-pointer transition-all ${
                          selectedRate?.id === rate.id
                            ? 'bg-green-50 border-l-4 border-l-green-500'
                            : index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50/50 hover:bg-blue-50'
                        }`}
                      >
                        {/* Carrier & Service Info - Col 1-4 */}
                        <div className="md:col-span-4 flex items-center gap-3">
                          {/* Selection Radio */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedRate?.id === rate.id
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {selectedRate?.id === rate.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>

                          {/* Carrier Logo */}
                          <div 
                            className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: rate.carrierColor || '#6B7280' }}
                          >
                            {rate.carrierLogo}
                          </div>

                          {/* Carrier Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">{rate.carrierName}</p>
                              {rate.badge && (
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${
                                  rate.badge === 'Best Value' ? 'bg-green-500' :
                                  rate.badge === 'Fastest' ? 'bg-orange-500' :
                                  rate.badge === 'Top Rated' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}>
                                  {rate.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{rate.serviceType}</p>
                            <p className="text-xs text-gray-400">{rate.serviceDescription}</p>
                          </div>
                        </div>

                        {/* Delivery Time - Col 5-6 */}
                        <div className="md:col-span-2 flex md:flex-col items-center md:justify-center gap-2 md:gap-0">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Clock size={15} className="text-gray-400" />
                            <span className="text-sm font-medium">{rate.estimatedDays} {rate.estimatedDays === '1' ? 'day' : 'days'}</span>
                          </div>
                          <p className="text-xs text-green-600 font-medium">{rate.deliveryDateMin}</p>
                          {rate.deliveryDateMin !== rate.deliveryDateMax && (
                            <p className="text-xs text-gray-400">to {rate.deliveryDateMax}</p>
                          )}
                        </div>

                        {/* Rating - Col 7 */}
                        <div className="md:col-span-1 flex items-center justify-center gap-1">
                          <Star size={15} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{rate.carrierRating}</span>
                        </div>

                        {/* Features - Col 8-10 */}
                        <div className="md:col-span-3 flex flex-wrap items-center gap-1">
                          {rate.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price - Col 11-12 */}
                        <div className="md:col-span-2 flex flex-col items-end justify-center">
                          {rate.discount ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 line-through">${rate.listPrice}</span>
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                  -{rate.discountPercent}%
                                </span>
                              </div>
                              <p className="text-xl font-bold text-green-600">${rate.price}</p>
                              <p className="text-xs text-green-500">Account Rate</p>
                            </>
                          ) : (
                            <>
                              <p className="text-xl font-bold text-gray-900">${rate.price}</p>
                              <p className="text-xs text-gray-400">{rate.currency}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Rate Summary */}
                {selectedRate && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: selectedRate.carrierColor || '#10B981' }}
                        >
                          {selectedRate.carrierLogo}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Selected: {selectedRate.carrierName} - {selectedRate.serviceType}
                          </p>
                          <p className="text-xs text-green-600">
                            Est. delivery: {selectedRate.deliveryDateMin}{selectedRate.deliveryDateMin !== selectedRate.deliveryDateMax ? ` - ${selectedRate.deliveryDateMax}` : ''}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {selectedRate.features.slice(0, 4).map((feature) => (
                              <span key={feature} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                          {selectedRate.accountNumber && (
                            <p className="text-xs text-blue-600 mt-1">
                              📋 Account: {selectedRate.accountNumber} • {selectedRate.paymentTerms === 'shipper' ? 'Prepaid' : selectedRate.paymentTerms === 'receiver' ? 'Collect' : 'Third Party'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedRate.discount ? (
                          <>
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="text-sm text-gray-400 line-through">${selectedRate.listPrice}</span>
                              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-medium">
                                SAVE ${selectedRate.discount}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">${selectedRate.price}</p>
                            <p className="text-xs text-green-600">Negotiated Rate • {selectedRate.estimatedDays} business {selectedRate.estimatedDays === '1' ? 'day' : 'days'}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-green-700">${selectedRate.price}</p>
                            <p className="text-xs text-green-600">{selectedRate.estimatedDays} business {selectedRate.estimatedDays === '1' ? 'day' : 'days'}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Rates State */}
            {!fetchingRates && rates.length === 0 && canFetchRates() && (
              <div className="text-center py-6 text-gray-500">
                <Truck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Click "Fetch Rates" to get shipping quotes</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
