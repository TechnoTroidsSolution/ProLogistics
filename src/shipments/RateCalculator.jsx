import { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Package, 
  DollarSign, 
  Truck, 
  Clock, 
  RefreshCw, 
  Star, 
  Layers, 
  Filter, 
  Building2, 
  CreditCard,
  ArrowRight,
  Scale,
  Ruler,
  Info
} from 'lucide-react';
import { calculateRates, CARRIERS_DATA } from '../data/ratesData';

/**
 * Rate Calculator Page
 * Quick rate lookup without creating a shipment
 */
export default function RateCalculator() {
  // Form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    packageType: 'parcel',
  });

  // Rates state
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');

  // Rate mode: 'all' = Shop Rates (all carriers), 'single' = Single Carrier
  const [rateMode, setRateMode] = useState('all');
  const [selectedCarrierId, setSelectedCarrierId] = useState('');

  // Single Carrier Account Details
  const [carrierAccount, setCarrierAccount] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('shipper');
  const [thirdPartyAccount, setThirdPartyAccount] = useState('');

  // Demo carrier accounts
  const CARRIER_ACCOUNTS = {
    'CAR-001': [{ id: 'ACC-FF-001', number: 'FF-789456123', name: 'FastFreight Main Account' }, { id: 'ACC-FF-002', number: 'FF-321654987', name: 'FastFreight Secondary' }],
    'CAR-002': [{ id: 'ACC-TG-001', number: 'TG-456789123', name: 'TransGlobal Primary' }],
    'CAR-003': [{ id: 'ACC-MH-001', number: 'MH-987654321', name: 'Metro Haulers Corporate' }, { id: 'ACC-MH-002', number: 'MH-123456789', name: 'Metro Haulers Regional' }],
    'CAR-004': [{ id: 'ACC-QS-001', number: 'QS-741852963', name: 'QuickShip Enterprise' }],
    'CAR-005': [{ id: 'ACC-UF-001', number: 'UF-369258147', name: 'United Freight Standard' }],
    'CAR-006': [{ id: 'ACC-PL-001', number: 'PL-852963741', name: 'Prime Logistics Premium' }, { id: 'ACC-PL-002', number: 'PL-147258369', name: 'Prime Logistics Basic' }],
  };

  // Popular cities for quick selection
  const popularCities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'San Francisco', 'Seattle', 'Denver', 'Miami', 'Atlanta'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canFetchRates = () => {
    const hasBasicInfo = formData.origin.trim() && 
           formData.destination.trim() && 
           formData.weight && 
           Number.parseFloat(formData.weight) > 0;
    
    if (rateMode === 'single') {
      const hasCarrierInfo = selectedCarrierId && carrierAccount;
      const hasPaymentInfo = paymentTerms !== 'third_party' || thirdPartyAccount.trim();
      return hasBasicInfo && hasCarrierInfo && hasPaymentInfo;
    }
    
    return hasBasicInfo;
  };

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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const calculatedRates = calculateRates({
        origin: formData.origin,
        destination: formData.destination,
        weight: formData.weight,
        priority: 'normal',
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

  const clearForm = () => {
    setFormData({
      origin: '',
      destination: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      packageType: 'parcel',
    });
    setRates([]);
    setSelectedRate(null);
    setRatesError('');
  };

  const selectCity = (city, field) => {
    setFormData(prev => ({ ...prev, [field]: city }));
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Rate Calculator</h1>
            <p className="text-sm text-gray-500">Get instant shipping quotes</p>
          </div>
        </div>
        <button
          onClick={clearForm}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear Form
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-1 space-y-4">
          {/* Shipment Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Package className="text-blue-600" size={18} />
              <h2 className="font-semibold text-gray-900">Shipment Details</h2>
            </div>

            {/* Origin */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <MapPin size={12} className="inline mr-1" />
                Origin City *
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g., New York"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                list="origin-cities"
              />
              <datalist id="origin-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            {/* Destination */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <MapPin size={12} className="inline mr-1" />
                Destination City *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Los Angeles"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                list="dest-cities"
              />
              <datalist id="dest-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            {/* Quick Route Display */}
            {formData.origin && formData.destination && (
              <div className="mb-4 p-2 bg-blue-50 rounded-lg flex items-center justify-center gap-2 text-sm">
                <span className="font-medium text-blue-700">{formData.origin}</span>
                <ArrowRight size={16} className="text-blue-400" />
                <span className="font-medium text-blue-700">{formData.destination}</span>
              </div>
            )}

            {/* Weight */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Scale size={12} className="inline mr-1" />
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0.00"
                min="0.1"
                step="0.1"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Dimensions (Optional) */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Ruler size={12} className="inline mr-1" />
                Dimensions (cm) - Optional
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="L"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="W"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="H"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
              </div>
            </div>

            {/* Package Type */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Package Type</label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="envelope">📄 Envelope</option>
                <option value="parcel">📦 Parcel</option>
                <option value="pallet">🏗️ Pallet</option>
                <option value="freight">🚛 Freight</option>
              </select>
            </div>
          </div>

          {/* Rate Mode Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <DollarSign className="text-green-600" size={18} />
              <h2 className="font-semibold text-gray-900">Rate Mode</h2>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
              <button
                type="button"
                onClick={() => {
                  setRateMode('all');
                  setRates([]);
                  setSelectedRate(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  rateMode === 'all'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers size={16} />
                <span>Shop Rates</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRateMode('single');
                  setRates([]);
                  setSelectedRate(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  rateMode === 'single'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Filter size={16} />
                <span>Single Carrier</span>
              </button>
            </div>

            {/* Single Carrier Options */}
            {rateMode === 'single' && (
              <div className="space-y-3">
                {/* Carrier Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Carrier</label>
                  <select
                    value={selectedCarrierId}
                    onChange={(e) => {
                      setSelectedCarrierId(e.target.value);
                      setCarrierAccount('');
                      setRates([]);
                      setSelectedRate(null);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    <option value="">🚚 Select a Carrier</option>
                    {CARRIERS_DATA.map((carrier) => (
                      <option key={carrier.id} value={carrier.id}>
                        {carrier.name} (★ {carrier.rating})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Selection */}
                {selectedCarrierId && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label>
                    <select
                      value={carrierAccount}
                      onChange={(e) => setCarrierAccount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select Account</option>
                      {(CARRIER_ACCOUNTS[selectedCarrierId] || []).map((acc) => (
                        <option key={acc.id} value={acc.number}>
                          {acc.number} - {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Terms */}
                {selectedCarrierId && carrierAccount && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Bill To</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="shipper">💳 Shipper (Prepaid)</option>
                      <option value="receiver">📦 Receiver (Collect)</option>
                      <option value="third_party">🏢 Third Party</option>
                    </select>
                  </div>
                )}

                {/* Third Party Account */}
                {paymentTerms === 'third_party' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Third Party Account</label>
                    <input
                      type="text"
                      value={thirdPartyAccount}
                      onChange={(e) => setThirdPartyAccount(e.target.value)}
                      placeholder="Enter account number"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mode Description */}
            <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
              <Info size={12} className="mt-0.5 flex-shrink-0" />
              {rateMode === 'all' 
                ? 'Compare rates from all available carriers.'
                : 'Get negotiated account rates from your preferred carrier.'}
            </p>
          </div>

          {/* Fetch Rates Button */}
          <button
            type="button"
            onClick={fetchRates}
            disabled={fetchingRates || !canFetchRates()}
            className={`w-full px-4 py-3 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${
              canFetchRates()
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {fetchingRates ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Calculating Rates...
              </>
            ) : (
              <>
                <Calculator size={20} />
                Calculate Rates
              </>
            )}
          </button>

          {/* Requirements Hint */}
          {!canFetchRates() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>Required:</strong> Origin, Destination, Weight
                {rateMode === 'single' && !selectedCarrierId && ', Carrier'}
                {rateMode === 'single' && selectedCarrierId && !carrierAccount && ', Account'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[500px]">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Truck className="text-green-600" size={18} />
              <h2 className="font-semibold text-gray-900">Available Rates</h2>
              {rates.length > 0 && (
                <span className="ml-auto text-sm text-gray-500">
                  {rates.length} options found
                </span>
              )}
            </div>

            {/* Error Message */}
            {ratesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">{ratesError}</p>
              </div>
            )}

            {/* Loading State */}
            {fetchingRates && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <RefreshCw size={40} className="animate-spin text-green-600 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {rateMode === 'all' 
                      ? 'Fetching rates from all carriers...'
                      : `Fetching rates from ${CARRIERS_DATA.find(c => c.id === selectedCarrierId)?.name}...`}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!fetchingRates && rates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Calculator size={48} className="mb-3" />
                <p className="text-lg font-medium text-gray-500">No rates yet</p>
                <p className="text-sm">Fill in the shipment details and click Calculate</p>
              </div>
            )}

            {/* Rates List */}
            {!fetchingRates && rates.length > 0 && (
              <div className="space-y-3">
                {/* Route Summary */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>
                    Route: <strong>{formData.origin}</strong> → <strong>{formData.destination}</strong>
                  </span>
                  <span>Weight: <strong>{formData.weight} kg</strong></span>
                </div>

                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 uppercase">
                  <div className="col-span-4">Carrier / Service</div>
                  <div className="col-span-2 text-center">Delivery</div>
                  <div className="col-span-1 text-center">Rating</div>
                  <div className="col-span-3">Features</div>
                  <div className="col-span-2 text-right">Price</div>
                </div>

                {/* Rate Items */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {rates.map((rate, index) => (
                    <div
                      key={rate.id}
                      onClick={() => setSelectedRate(rate)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedRate?.id === rate.id
                          ? 'bg-green-50 border-green-400 shadow-md'
                          : 'bg-gray-50 border-transparent hover:bg-blue-50 hover:border-blue-200'
                      }`}
                    >
                      {/* Carrier Info - Col 1-4 */}
                      <div className="md:col-span-4 flex items-center gap-3">
                        <div 
                          className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: rate.carrierColor || '#6B7280' }}
                        >
                          {rate.carrierLogo}
                        </div>
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
                      </div>

                      {/* Rating - Col 7 */}
                      <div className="md:col-span-1 flex items-center justify-center gap-1">
                        <Star size={15} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{rate.carrierRating}</span>
                      </div>

                      {/* Features - Col 8-10 */}
                      <div className="md:col-span-3 flex flex-wrap items-center gap-1">
                        {rate.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
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

                {/* Selected Rate Summary */}
                {selectedRate && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-md"
                          style={{ backgroundColor: selectedRate.carrierColor || '#10B981' }}
                        >
                          {selectedRate.carrierLogo}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-green-800">
                            {selectedRate.carrierName} - {selectedRate.serviceType}
                          </p>
                          <p className="text-sm text-green-600">
                            Delivery by {selectedRate.deliveryDateMin}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {selectedRate.features.slice(0, 3).map((feature) => (
                              <span key={feature} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedRate.discount ? (
                          <>
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="text-sm text-gray-400 line-through">${selectedRate.listPrice}</span>
                              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-bold">
                                SAVE ${selectedRate.discount}
                              </span>
                            </div>
                            <p className="text-3xl font-bold text-green-700">${selectedRate.price}</p>
                            <p className="text-xs text-green-600">Negotiated Account Rate</p>
                          </>
                        ) : (
                          <>
                            <p className="text-3xl font-bold text-green-700">${selectedRate.price}</p>
                            <p className="text-sm text-green-600">{selectedRate.currency}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-green-200">
                      <button
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => window.location.href = '/shipments/create'}
                      >
                        Create Shipment with this Rate
                      </button>
                      <button
                        className="px-4 py-2 bg-white text-green-700 font-medium rounded-lg border border-green-300 hover:bg-green-50 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`${selectedRate.carrierName} ${selectedRate.serviceType}: $${selectedRate.price}`)}
                      >
                        Copy Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
