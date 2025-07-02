import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { supabase } from '../integrations/supabase/client';
import { Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, category, price, created_at');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, title) => {
    setRemoving(id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', message: `Product "${title}" removed successfully.` });
      fetchProducts();
    } catch (error) {
      setToast({ type: 'error', message: `Failed to remove product "${title}".` });
      console.error('Remove product error:', error);
    } finally {
      setRemoving(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(product => {
    const q = search.toLowerCase();
    return (
      product.title.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  });

  // Confirmation dialog state
  const [confirm, setConfirm] = useState({ open: false, id: null, title: '' });

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Products Management</h2>
        {/* Search bar */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="input-field max-w-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold gradient-text">All Products</h3>
          </div>
          <div className="card-body overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Product Name</th>
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-left py-2 px-4">Price</th>
                  <th className="text-left py-2 px-4">Added</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">Loading...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">No products found.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-sayebo-pink-50 transition-colors">
                      <td className="py-2 px-4 font-medium align-middle">{product.title}</td>
                      <td className="py-2 px-4 align-middle">{product.category}</td>
                      <td className="py-2 px-4 align-middle">R{product.price.toLocaleString()}</td>
                      <td className="py-2 px-4 align-middle">{new Date(product.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-4 align-middle text-center">
                        <button
                          className="btn-outline text-red-600 flex items-center justify-center gap-2 mx-auto"
                          style={{ minWidth: 100 }}
                          disabled={removing === product.id}
                          onClick={() => setConfirm({ open: true, id: product.id, title: product.title })}
                        >
                          <Trash2 className="w-4 h-4" />
                          {removing === product.id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Confirmation Dialog */}
        {confirm.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-2 text-red-600">Remove Product?</h3>
              <p className="mb-6">Are you sure you want to remove <span className="font-semibold">{confirm.title}</span>? This cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button className="btn-secondary" onClick={() => setConfirm({ open: false, id: null, title: '' })}>Cancel</button>
                <button
                  className="btn-primary bg-gradient-to-r from-red-500 to-orange-500"
                  onClick={() => {
                    setConfirm({ open: false, id: null, title: '' });
                    handleRemove(confirm.id, confirm.title);
                  }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts; 