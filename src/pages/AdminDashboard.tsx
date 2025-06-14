
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Users, Package, TrendingUp, Shield, Ban, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  seller_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0
  });

  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    fetchAdminData();
  }, [user, profile, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch products with seller info
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const totalSellers = usersData?.filter(u => u.role === 'seller').length || 0;
      const totalProducts = productsData?.length || 0;

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id');
      
      setStats({
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders: ordersData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      const { error } = await supabase.rpc('suspend_user', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "User suspended",
        description: "User has been suspended successfully."
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend user.",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been removed successfully."
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  const toggleCategory = async (categoryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !isActive })
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: isActive ? "Category deactivated" : "Category activated",
        description: `Category has been ${isActive ? 'deactivated' : 'activated'} successfully.`
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update category status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-pink-400 font-medium">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="w-8 h-8 text-pink-400 mr-3" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users, products, and platform settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'products', label: 'Products' },
              { id: 'categories', label: 'Categories' }
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
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sellers</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalSellers}</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-pink-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">User</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-600">
                          {user.first_name} {user.last_name} ({user.email})
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Joined</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-800">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => suspendUser(user.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Seller</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-800">{product.title}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.profiles?.first_name} {product.profiles?.last_name}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-800">
                        R{product.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {category.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {category.description}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(category.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleCategory(category.id, category.is_active)}
                          className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
                          title={category.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {category.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
