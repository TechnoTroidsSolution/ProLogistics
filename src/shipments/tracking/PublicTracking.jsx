import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  MapPin, 
  Truck, 
  Clock, 
  Shield, 
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

/**
 * Public Tracking Page
 * Allows anyone to track a shipment by entering their tracking/order ID
 */
export default function PublicTracking() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking or order ID');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simulate API lookup delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Navigate to tracking page with the ID
    // In real app, this would validate the ID exists first
    if (trackingId.startsWith('ORD-')) {
      navigate(`/tracking?orderId=${trackingId.trim()}`);
    } else if (trackingId.startsWith('SHP-')) {
      navigate(`/tracking/${trackingId.trim()}`);
    } else {
      // Try as order ID first
      navigate(`/tracking?orderId=${trackingId.trim()}`);
    }

    setIsSearching(false);
  };

  const features = [
    {
      icon: MapPin,
      title: 'Real-Time Location',
      description: 'Track your shipment on an interactive map with live updates',
    },
    {
      icon: Clock,
      title: 'Accurate ETA',
      description: 'Get precise estimated delivery times based on current conditions',
    },
    {
      icon: Shield,
      title: 'Secure Tracking',
      description: 'Your tracking information is secure and private',
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Receive notifications for important shipment updates',
    },
  ];

  const demoIds = ['ORD-2026-001', 'ORD-2026-003', 'SHP-006'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white">LogiTrack</span>
          </div>
          <a
            href="/login"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Track Your Shipment
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Enter your tracking number or order ID to get real-time updates on your delivery
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter tracking number or order ID"
                    className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Truck size={20} />
                      Track
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-red-200 text-center">{error}</p>
            )}
          </form>

          {/* Demo IDs */}
          <div className="mt-6 text-center">
            <p className="text-primary-200 text-sm mb-2">Try these demo IDs:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {demoIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setTrackingId(id)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-mono rounded-lg transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-primary-200 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How Tracking Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { step: 1, title: 'Enter ID', desc: 'Input your tracking or order number' },
              { step: 2, title: 'View Map', desc: 'See your package on the live map' },
              { step: 3, title: 'Get Updates', desc: 'Receive real-time notifications' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-24 h-0.5 bg-white/30" />
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-primary-200 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10M+', label: 'Packages Tracked' },
            { value: '99.9%', label: 'Uptime' },
            { value: '< 2s', label: 'Update Speed' },
            { value: '50+', label: 'Cities Covered' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-primary-200 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-black/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="text-white" size={20} />
              <span className="text-white font-semibold">LogiTrack</span>
            </div>
            <div className="flex items-center gap-6 text-primary-200 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-primary-300 text-sm">
              © 2026 LogiTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
