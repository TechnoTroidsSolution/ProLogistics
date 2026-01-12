import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store';
import { LogOut } from 'lucide-react';

/**
 * Logout Component
 * Handles user logout and redirects to login page
 */
export default function Logout() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      if (isAuthenticated) {
        await logout();
      }
      // Small delay for UX
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    };

    performLogout();
  }, [logout, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <LogOut size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing out...</h2>
        <p className="text-gray-600">Thank you for using Logistics Pro</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
