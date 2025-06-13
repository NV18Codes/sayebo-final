
import { useState } from 'react';
import { Header } from '../components/Header';
import { Package, TrendingUp, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalSales: 45780,
    totalOrders: 127,
    totalProducts: 23,
    totalCustomers: 89
  };

  const products = [
    {
      id: 1,
      name: 'African Print Dress',
      price: 899,
      stock: 15,
      sold: 23,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Boho Chic Blouse',
      price: 549,
      stock: 8,
      sold: 12,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Summer Maxi Dress',
      price: 1299,
      stock: 0,
      sold: 34,
      status: 'Out of Stock'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      customer: 'Sarah Johnson',
      total: 1299,
      status: 'Processing',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Michael Chen',
      total: 899,
      status: 'Shipped',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Emma Wilson',
      total: 549,
      status: 'Delivered',
      date: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your products and track your sales</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: 'Products' },
              { id: 'orders', label: 'Orders' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-400 text-pink-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-800">R{stats.totalSales.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
                  </div>
                  <Users className="w-8 h-8 text-pink-500" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-800">{order.id}</td>
                        <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                        <td className="py-3 text-sm font-medium text-gray-800">R{order.total.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Stock</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Sold</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">{product.name}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">R{product.price.toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{product.stock}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{product.sold}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-500">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-500">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{order.customer}</td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">R{order.total.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{order.date}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-500">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-500">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-center py-12">
                Analytics dashboard coming soon. Connect with Supabase to enable detailed analytics and reporting.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
