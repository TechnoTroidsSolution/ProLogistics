# Logistics Pro - Tier 1

A production-ready logistics application for core shipment operations, carrier management, basic tracking, and admin dashboard.

## 🎯 Features Implemented (Tier-1)

### 🔐 Authentication & Users
- ✅ User Login with email/password
- ✅ User Logout
- ✅ Protected routes for authenticated users
- ✅ Session persistence with Zustand

### 📦 Shipment / Order Management
- ✅ Create Shipment (full form with validation)
- ✅ Edit Shipment
- ✅ View Shipment List (with filtering and pagination)
- ✅ Shipment Details Page
- ✅ Shipment Status lifecycle: Created → In Transit → Delivered

### 📍 Shipment Tracking
- ✅ Manual shipment status update
- ✅ Shipment status history (timeline view)
- ✅ Search shipment by Order ID

### 🚚 Vehicle / Carrier Management
- ✅ Add Vehicle / Carrier
- ✅ Assign Vehicle to Shipment
- ✅ View assigned vehicle details per shipment

### 📊 Admin Dashboard
- ✅ Total Shipments Count
- ✅ Active Shipments Count
- ✅ Delivered Shipments Count
- ✅ Recent shipment activity list

## 🏗️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **State Management:** Zustand
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **HTTP Client:** Axios

## 📁 Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                    # API communication
│   │   ├── axiosClient.js      # Axios instance with interceptors
│   │   ├── auth.api.js         # Auth endpoints
│   │   ├── shipment.api.js     # Shipment CRUD endpoints
│   │   ├── carrier.api.js      # Carrier/Vehicle endpoints
│   │   └── dashboard.api.js    # Dashboard stats endpoints
│   │
│   ├── auth/                   # Authentication module
│   │   ├── Login.jsx           # Login page
│   │   ├── Logout.jsx          # Logout handler
│   │   ├── ProtectedRoute.jsx  # Route guard HOC
│   │   └── auth.store.js       # Auth state (Zustand)
│   │
│   ├── shipments/              # Shipment module
│   │   ├── ShipmentList.jsx    # List all shipments
│   │   ├── ShipmentCreate.jsx  # Create new shipment
│   │   ├── ShipmentEdit.jsx    # Edit shipment
│   │   ├── ShipmentDetails.jsx # View shipment details
│   │   ├── ShipmentTimeline.jsx# Status history timeline
│   │   └── shipment.store.js   # Shipment state (Zustand)
│   │
│   ├── carriers/               # Carrier/Vehicle module
│   │   ├── CarrierList.jsx     # List all carriers
│   │   ├── CarrierCreate.jsx   # Create new carrier
│   │   ├── VehicleList.jsx     # List/manage vehicles
│   │   └── carrier.store.js    # Carrier/Vehicle state
│   │
│   ├── dashboard/              # Admin dashboard
│   │   └── Dashboard.jsx       # Main dashboard page
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Side navigation
│   │   ├── MainLayout.jsx      # Page layout wrapper
│   │   ├── Loader.jsx          # Loading spinner
│   │   └── StatusBadge.jsx     # Status indicator badge
│   │
│   ├── routes/                 # App routes
│   │   └── AppRoutes.jsx       # Route definitions
│   │
│   ├── utils/                  # Helpers & utilities
│   │   ├── constants.js        # Enum constants
│   │   ├── statusMapper.js     # Status config mapping
│   │   └── formatters.js       # Date/text formatters
│   │
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Logistics Pro
```

## 📐 Architecture

### State Management (Zustand)

Each feature module has its own store:

```javascript
// Example: shipment.store.js
export const useShipmentStore = create((set, get) => ({
  // State
  shipments: [],
  currentShipment: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchShipments: async () => { /* ... */ },
  createShipment: async (data) => { /* ... */ },
  updateShipmentStatus: async (id, status) => { /* ... */ },
}));
```

### API Layer

Centralized API client with interceptors:

```javascript
// axiosClient.js - handles auth tokens & errors
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Status Handling (Enum-based)

```javascript
// constants.js
export const SHIPMENT_STATUS = {
  CREATED: 'Created',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

// statusMapper.js - provides colors, icons, transitions
export const getStatusConfig = (status) => STATUS_CONFIG[status];
```

## 📝 API Contract

### Authentication

```
POST /api/auth/login
Request:  { email: string, password: string }
Response: { user: User, token: string }

POST /api/auth/logout
Response: { success: boolean }
```

### Shipments

```
GET /api/shipments
Query: { status?, search?, page?, limit? }
Response: { shipments: Shipment[], total: number }

POST /api/shipments
Request: ShipmentCreateDTO
Response: Shipment

GET /api/shipments/:id
Response: Shipment

PUT /api/shipments/:id
Request: ShipmentUpdateDTO
Response: Shipment

PATCH /api/shipments/:id/status
Request: { status: string, notes?: string, location?: string }
Response: Shipment

GET /api/shipments/:id/history
Response: StatusHistoryItem[]

PATCH /api/shipments/:id/assign-vehicle
Request: { vehicleId: string }
Response: Shipment
```

### Carriers/Vehicles

```
GET /api/carriers
Response: { carriers: Carrier[] }

POST /api/carriers
Request: CarrierDTO
Response: Carrier

GET /api/vehicles
Response: { vehicles: Vehicle[] }

POST /api/vehicles
Request: VehicleDTO
Response: Vehicle

GET /api/vehicles/available
Response: Vehicle[]
```

### Dashboard

```
GET /api/dashboard/stats
Response: {
  totalShipments: number,
  activeShipments: number,
  deliveredShipments: number,
  inTransitShipments: number
}

GET /api/dashboard/recent-activity
Query: { limit?: number }
Response: ActivityItem[]
```

## 🔌 Extension Points for Future Tiers

### Tier-2 Additions
- [ ] User registration & profile management
- [ ] Multi-role authorization (admin, dispatcher, driver)
- [ ] Real-time tracking with WebSockets
- [ ] Document attachments (POD, invoices)
- [ ] Email/SMS notifications
- [ ] Basic reports & exports

### Tier-3 Additions
- [ ] Route optimization
- [ ] Multi-tenant organizations
- [ ] External carrier API integrations
- [ ] Payment processing
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## 🎨 UI/UX Features

- Modern admin dashboard layout
- Responsive sidebar navigation
- Status badges with color coding
- Clean forms with validation
- Loading states & error handling
- Modal dialogs for confirmations
- Data-driven timeline component

## 📄 License

MIT License - feel free to use for your projects.
