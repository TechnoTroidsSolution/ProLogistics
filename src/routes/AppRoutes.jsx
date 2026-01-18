import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from '../auth/Login';
import Logout from '../auth/Logout';
import ProtectedRoute from '../auth/ProtectedRoute';

// Layout
import MainLayout from '../components/MainLayout';

// Pages
import Dashboard from '../dashboard/Dashboard';
import ShipmentList from '../shipments/ShipmentList';
import ShipmentCreate from '../shipments/ShipmentCreate';
import ShipmentEdit from '../shipments/ShipmentEdit';
import ShipmentDetails from '../shipments/ShipmentDetails';
import CarrierList from '../carriers/CarrierList';
import CarrierCreate from '../carriers/CarrierCreate';
import VehicleList from '../carriers/VehicleList';
import InventoryList from '../inventory/InventoryList';

// Tracking
import { ShipmentTracking, PublicTracking } from '../shipments/tracking';

/**
 * Application Routes
 * Defines all routes including protected routes
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      
      {/* Public Tracking Page */}
      <Route path="/track" element={<PublicTracking />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Shipments */}
        <Route path="shipments">
          <Route index element={<ShipmentList />} />
          <Route path="create" element={<ShipmentCreate />} />
          <Route path=":id" element={<ShipmentDetails />} />
          <Route path=":id/edit" element={<ShipmentEdit />} />
          <Route path=":id/tracking" element={<ShipmentTracking />} />
        </Route>
        
        {/* Tracking (authenticated) */}
        <Route path="tracking">
          <Route index element={<ShipmentTracking />} />
          <Route path=":id" element={<ShipmentTracking />} />
        </Route>

        {/* Carriers */}
        <Route path="carriers">
          <Route index element={<CarrierList />} />
          <Route path="create" element={<CarrierCreate />} />
        </Route>

        {/* Vehicles */}
        <Route path="vehicles" element={<VehicleList />} />

        {/* Inventory */}
        <Route path="inventory">
          <Route index element={<InventoryList />} />
        </Route>
      </Route>

      {/* 404 - Catch all */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
              <a
                href="/dashboard"
                className="inline-block mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
