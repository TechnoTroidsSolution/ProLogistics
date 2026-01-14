import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from '../auth/Login';
import Logout from '../auth/Logout';
import ProtectedRoute from '../auth/ProtectedRoute';

// Layout
import MainLayout from '../components/MainLayoutNew';

// Pages
import Dashboard from '../dashboard/Dashboard';
import ShipmentList from '../shipments/ShipmentList';
import ShipmentCreate from '../shipments/ShipmentCreate';
import ShipmentEdit from '../shipments/ShipmentEdit';
import ShipmentDetails from '../shipments/ShipmentDetails';
import RateCalculator from '../shipments/RateCalculator';
import CarrierList from '../carriers/CarrierList';
import CarrierCreate from '../carriers/CarrierCreate';
import VehicleList from '../carriers/VehicleList';
import InventoryList from '../inventory/InventoryList';

// Placeholder components for new routes
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-500 mt-2">Coming soon...</p>
    </div>
  </div>
);

/**
 * Application Routes
 * Defines all routes including protected routes with section-based navigation
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

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

        {/* ============ DASHBOARD SECTION ============ */}
        <Route path="dashboard">
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="performance" element={<PlaceholderPage title="Performance" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        </Route>

        {/* ============ RATE/SHIP SECTION ============ */}
        <Route path="shipments">
          <Route index element={<ShipmentList />} />
          <Route path="create" element={<ShipmentCreate />} />
          <Route path="rates" element={<RateCalculator />} />
          <Route path="calculator" element={<RateCalculator />} />
          <Route path="history" element={<PlaceholderPage title="Shipment History" />} />
          <Route path=":id" element={<ShipmentDetails />} />
          <Route path=":id/edit" element={<ShipmentEdit />} />
        </Route>
        
        <Route path="tracking" element={<PlaceholderPage title="Shipment Tracking" />} />

        {/* ============ SETUP SECTION ============ */}
        <Route path="setup">
          <Route index element={<Navigate to="/setup/carriers" replace />} />
          <Route path="carriers" element={<CarrierList />} />
          <Route path="carriers/create" element={<CarrierCreate />} />
          <Route path="vehicles" element={<VehicleList />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="users" element={<PlaceholderPage title="User Management" />} />
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
        </Route>

        {/* Legacy routes - redirect to new structure */}
        <Route path="carriers" element={<Navigate to="/setup/carriers" replace />} />
        <Route path="carriers/*" element={<Navigate to="/setup/carriers" replace />} />
        <Route path="vehicles" element={<Navigate to="/setup/vehicles" replace />} />
        <Route path="inventory" element={<Navigate to="/setup/inventory" replace />} />
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
