import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShipmentStore } from './shipment.store';
import { useInventoryStore } from '../inventory/inventory.store';
import { SHIPMENT_STATUS } from '../utils/constants';
import { ArrowLeft, Save, Package, MapPin, User, Phone, Mail, FileText, Plus, Trash2, Box, Search, X, ShoppingCart } from 'lucide-react';

/**
 * Shipment Create Page
 * Form for creating new shipments
 */
export default function ShipmentCreate() {
  const navigate = useNavigate();
  const { createShipment, isLoading, error } = useShipmentStore();
  const { items: inventoryItems, fetchInventory, searchInventory, filterByCategory, getFilteredItems, searchQuery, categoryFilter } = useInventoryStore();

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
        </div>
      </form>
    </div>
  );
}
