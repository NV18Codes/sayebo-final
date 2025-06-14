
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmazonStyleHeader } from '../components/AmazonStyleHeader';
import { Package, TrendingUp, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { CategorySelector } from '../components/CategorySelector';
import { ImageUpload } from '../components/ImageUpload';
import { CategoryVariants } from '../components/CategoryVariants';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  description: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: ''
  });
  const [productVariants, setProductVariants] = useState<any[]>([]);

  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (profile && profile.role !== 'seller') {
      toast({
        title: "Access denied",
        description: "You need a seller account to access this page. Please register as a seller.",
        variant: "destructive"
      });
      navigate('/register');
      return;
    }

    if (profile?.role === 'seller') {
      fetchSellerData();
    }
  }, [user, profile, navigate]);

  const fetchSellerData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id);

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch orders for seller's products
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          profiles(first_name, last_name),
          order_items!inner(
            product_id,
            products!inner(seller_id)
          )
        `)
        .eq('order_items.products.seller_id', user.id);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const productData = {
        title: productForm.title,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        image_url: productForm.image_url,
        seller_id: user.id
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({
          title: "Product updated",
          description: "Your product has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        toast({
          title: "Product added",
          description: "Your product has been added successfully."
        });
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: ''
      });
      setProductVariants([]);
      fetchSellerData();

    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully."
      });
      
      fetchSellerData();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalSales: orders.reduce((sum, order) => sum + order.total_amount, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: new Set(orders.map(order => `${order.profiles.first_name} ${order.profiles.last_name}`)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AmazonStyleHeader />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-pink-400 font-medium">Loading seller dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-100">
        <AmazonStyleHeader />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg p-8 shadow-lg max-w-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Become a Seller</h2>
            <p className="text-gray-600 mb-6">
              You need a seller account to access this dashboard. Start selling on Sayebo today!
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Register as Seller
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <AmazonStyleHeader />
      <main className="pt-4 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sayebo-pink-600 to-sayebo-orange-600 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">Manage your products and track your sales performance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-sayebo-pink-400 text-sayebo-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-800">R{stats.totalSales.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Products</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
                        <td className="py-3 text-sm font-medium text-gray-800">{order.id.slice(0, 8)}</td>
                        <td className="py-3 text-sm text-gray-600">{order.profiles.first_name} {order.profiles.last_name}</td>
                        <td className="py-3 text-sm font-medium text-gray-800">R{order.total_amount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
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
              <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
              <button 
                onClick={() => setShowProductForm(true)}
                className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-6">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Product title"
                        value={productForm.title}
                        onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                        required
                      />
                      
                      <input
                        type="number"
                        placeholder="Price (ZAR)"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                    
                    <textarea
                      placeholder="Product description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                      rows={4}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CategorySelector
                        value={productForm.category}
                        onChange={(category) => setProductForm({...productForm, category})}
                      />
                      
                      <input
                        type="number"
                        placeholder="Stock quantity"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image
                      </label>
                      <ImageUpload
                        value={productForm.image_url}
                        onChange={(url) => setProductForm({...productForm, image_url: url})}
                      />
                    </div>
                    
                    {/* Category Variants */}
                    {productForm.category && (
                      <CategoryVariants
                        category={productForm.category}
                        onVariantsChange={setProductVariants}
                        existingVariants={productVariants}
                      />
                    )}
                    
                    <div className="flex space-x-3 pt-4">
                      <button type="submit" className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex-1">
                        {editingProduct ? 'Update' : 'Add'} Product
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          setProductForm({
                            title: '',
                            description: '',
                            price: '',
                            category: '',
                            stock: '',
                            image_url: ''
                          });
                          setProductVariants([]);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Stock</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop'} 
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <span className="text-sm font-medium text-gray-800">{product.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">R{product.price.toLocaleString()}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{product.stock}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
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
            <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Customer</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Total</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">{order.id.slice(0, 8)}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{order.profiles.first_name} {order.profiles.last_name}</td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">R{order.total_amount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
