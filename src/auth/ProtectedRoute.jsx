import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './auth.store';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Check both isAuthenticated flag and token existence
  if (!isAuthenticated || !token) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
