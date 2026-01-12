import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * Header Component
 * Top navigation bar with user menu and notifications
 */
export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

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
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Menu Toggle (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="text-primary-600" size={14} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown 
                size={14} 
                className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@logistics.com'}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
