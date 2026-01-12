import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Building2,
  X,
  ChevronRight,
  Boxes,
} from 'lucide-react';
import clsx from 'clsx';

/**
 * Sidebar Component
 * Navigation sidebar with responsive mobile support
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Shipments',
      path: '/shipments',
      icon: Package,
    },
    {
      name: 'Carriers',
      path: '/carriers',
      icon: Building2,
    },
    {
      name: 'Vehicles',
      path: '/vehicles',
      icon: Truck,
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: Boxes,
    },
  ];

  const isActivePath = (path) => {
    if (path === '/shipments') {
      return location.pathname.startsWith('/shipments');
    }
    if (path === '/carriers') {
      return location.pathname === '/carriers' || location.pathname.startsWith('/carriers/');
    }
    if (path === '/vehicles') {
      return location.pathname === '/vehicles';
    }
    if (path === '/inventory') {
      return location.pathname.startsWith('/inventory');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-screen w-56 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-200">
          <div className="p-1.5 bg-primary-600 rounded-lg">
            <Package className="text-white" size={20} />
          </div>
          <span className="font-bold text-gray-900">Logistics Pro</span>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon size={18} className={isActive ? 'text-primary-600' : ''} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight size={16} className="text-primary-400" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-primary-700">Tier-1 Logistics</p>
            <p className="text-xs text-gray-500 mt-0.5">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
