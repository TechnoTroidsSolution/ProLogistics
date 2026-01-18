import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import {
  Package,
  LayoutDashboard,
  Send,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  Receipt,
  Users,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

/**
 * Top Navigation Bar Component
 * Main horizontal navigation with section tabs
 */
export default function TopNavBar({ onMenuClick, activeSection, onSectionChange }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'blue',
    },
    {
      id: 'rate-ship',
      name: 'Rate/Ship',
      icon: Send,
      path: '/shipments',
      color: 'green',
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: Receipt,
      path: '/billing/invoices',
      color: 'amber',
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: Users,
      path: '/customers',
      color: 'purple',
    },
    {
      id: 'setup',
      name: 'Setup',
      icon: Settings,
      path: '/setup/carriers',
      color: 'gray',
    },
  ];

  // Determine active section from current path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.startsWith('/shipments') || path.startsWith('/tracking') || path.startsWith('/labels')) return 'rate-ship';
    if (path.startsWith('/billing')) return 'billing';
    if (path.startsWith('/customers')) return 'customers';
    if (path.startsWith('/setup') || path.startsWith('/carriers') || path.startsWith('/vehicles') || path.startsWith('/inventory')) return 'setup';
    return 'dashboard';
  };

  const currentSection = getCurrentSection();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-800 text-white shadow-lg">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left side - Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-300 hover:bg-slate-700"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-500 rounded-lg">
              <Package className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg hidden sm:block">Logistics Pro</span>
          </div>
        </div>

        {/* Center - Main Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            return (
              <NavLink
                key={section.id}
                to={section.path}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                )}
              >
                <Icon size={16} />
                {section.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-700"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium leading-tight">
                  {user?.name || 'Admin User'}
                </p>
              </div>
              <ChevronDown 
                size={14} 
                className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-gray-700">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@logistics.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Section Tabs */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = currentSection === section.id;
          return (
            <NavLink
              key={section.id}
              to={section.path}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-white text-slate-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
            >
              <Icon size={14} />
              {section.name}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
