import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Box,
  RefreshCw,
} from 'lucide-react';
import { useInventoryStore } from './inventory.store';

/**
 * Inventory List Page
 * Displays all inventory items with search, filter, and CRUD operations
 */
export default function InventoryList() {
  const { inventory, fetchInventory, loading, deleteItem, updateStock } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingStock, setEditingStock] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const categories = ['all', 'electronics', 'clothing', 'furniture', 'documents', 'hazardous', 'appliances', 'medical'];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { color: 'red', label: 'Out of Stock', icon: AlertTriangle };
    if (stock <= minStock) return { color: 'yellow', label: 'Low Stock', icon: AlertTriangle };
    return { color: 'green', label: 'In Stock', icon: CheckCircle };
  };

  const handleStockUpdate = (itemId) => {
    if (newStockValue !== '') {
      updateStock(itemId, parseInt(newStockValue, 10));
    }
    setEditingStock(null);
    setNewStockValue('');
  };

  const handleDelete = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      deleteItem(itemId);
    }
  };

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock && item.stock > 0).length;
  const outOfStockItems = inventory.filter((item) => item.stock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + item.unitPrice * item.stock, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Manage your stock and product catalog</p>
        </div>
        <Link
          to="/inventory/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          Add Item
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Box className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Items</p>
              <p className="text-lg font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Stock</p>
              <p className="text-lg font-bold text-gray-900">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Low Stock</p>
              <p className="text-lg font-bold text-yellow-600">{lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Out of Stock</p>
              <p className="text-lg font-bold text-red-600">{outOfStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-primary-600" size={24} />
            <span className="ml-2 text-gray-500">Loading inventory...</span>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-12">
            <Box className="mx-auto text-gray-300" size={48} />
            <p className="mt-3 text-gray-500">No inventory items found</p>
            <Link
              to="/inventory/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
            >
              <Plus size={16} />
              Add First Item
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Weight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item.stock, item.minStock);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-600">{item.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">${item.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-600">{item.weight} kg</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editingStock === item.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                              min="0"
                              autoFocus
                            />
                            <button
                              onClick={() => handleStockUpdate(item.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStock(item.id);
                              setNewStockValue(item.stock.toString());
                            }}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600"
                          >
                            {item.stock}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            status.color === 'green'
                              ? 'bg-green-100 text-green-700'
                              : status.color === 'yellow'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingStock(item.id);
                              setNewStockValue(item.stock.toString());
                            }}
                            className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                            title="Edit Stock"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      {filteredInventory.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredInventory.length} of {inventory.length} items
        </div>
      )}
    </div>
  );
}
