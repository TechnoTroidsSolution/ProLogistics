import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Building2,
  X,
  ChevronRight,
  Boxes,
  Plus,
  List,
  MapPin,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Settings,
  DollarSign,
  Calculator,
} from 'lucide-react';
import clsx from 'clsx';

/**
 * Sidebar Component
 * Context-aware navigation sidebar based on active section
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // Determine current section from path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.startsWith('/shipments') || path.startsWith('/tracking')) return 'rate-ship';
    if (path.startsWith('/setup') || path.startsWith('/carriers') || path.startsWith('/vehicles') || path.startsWith('/inventory')) return 'setup';
    return 'dashboard';
  };

  const currentSection = getCurrentSection();

  // Define navigation items per section
  const sectionNavItems = {
    dashboard: [
      {
        name: 'Overview',
        path: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Analytics',
        path: '/dashboard/analytics',
        icon: BarChart3,
      },
      {
        name: 'Performance',
        path: '/dashboard/performance',
        icon: TrendingUp,
      },
      {
        name: 'Reports',
        path: '/dashboard/reports',
        icon: FileText,
      },
    ],
    'rate-ship': [
      {
        name: 'All Shipments',
        path: '/shipments',
        icon: List,
      },
      {
        name: 'Create Shipment',
        path: '/shipments/create',
        icon: Plus,
      },
      {
        name: 'Rate Calculator',
        path: '/shipments/calculator',
        icon: Calculator,
      },
      {
        name: 'Tracking',
        path: '/tracking',
        icon: MapPin,
      },
      {
        name: 'History',
        path: '/shipments/history',
        icon: Clock,
      },
    ],
    setup: [
      {
        name: 'Carriers',
        path: '/setup/carriers',
        icon: Building2,
      },
      {
        name: 'Vehicles',
        path: '/setup/vehicles',
        icon: Truck,
      },
      {
        name: 'Inventory',
        path: '/setup/inventory',
        icon: Boxes,
      },
      {
        name: 'Users',
        path: '/setup/users',
        icon: Users,
      },
      {
        name: 'Settings',
        path: '/setup/settings',
        icon: Settings,
      },
    ],
  };

  const navItems = sectionNavItems[currentSection] || sectionNavItems.dashboard;

  const sectionTitles = {
    dashboard: 'Dashboard',
    'rate-ship': 'Rate & Ship',
    setup: 'Setup',
  };

  const sectionColors = {
    dashboard: 'blue',
    'rate-ship': 'green',
    setup: 'purple',
  };

  const isActivePath = (path) => {
    if (path === '/shipments') {
      return location.pathname === '/shipments';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const color = sectionColors[currentSection];

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
          'fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Section Header */}
        <div className={clsx(
          'h-12 flex items-center justify-between px-4 border-b',
          color === 'blue' && 'bg-blue-50 border-blue-100',
          color === 'green' && 'bg-green-50 border-green-100',
          color === 'purple' && 'bg-purple-50 border-purple-100'
        )}>
          <span className={clsx(
            'font-semibold text-sm',
            color === 'blue' && 'text-blue-700',
            color === 'green' && 'text-green-700',
            color === 'purple' && 'text-purple-700'
          )}>
            {sectionTitles[currentSection]}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-3rem)]">
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
                    ? clsx(
                        color === 'blue' && 'bg-blue-50 text-blue-700',
                        color === 'green' && 'bg-green-50 text-green-700',
                        color === 'purple' && 'bg-purple-50 text-purple-700'
                      )
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  size={18}
                  className={clsx(
                    isActive
                      ? clsx(
                          color === 'blue' && 'text-blue-600',
                          color === 'green' && 'text-green-600',
                          color === 'purple' && 'text-purple-600'
                        )
                      : 'text-gray-400'
                  )}
                />
                <span>{item.name}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
