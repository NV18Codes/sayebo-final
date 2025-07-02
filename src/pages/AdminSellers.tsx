import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { supabase } from '../integrations/supabase/client';
import { Trash2, Star } from 'lucide-react';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerRevenue, setSellerRevenue] = useState(0);
  const [sellerTotalSold, setSellerTotalSold] = useState(0);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at, role')
        .eq('role', 'seller');
      if (error) throw error;
      setSellers(data || []);
      // Fetch product counts for each seller
      if (data && data.length > 0) {
        const ids = data.map(s => s.id);
        const { data: products, error: prodErr } = await supabase
          .from('products')
          .select('id, seller_id')
          .in('seller_id', ids);
        if (prodErr) throw prodErr;
        // Count products per seller
        const counts = {};
        products?.forEach(row => {
          counts[row.seller_id] = (counts[row.seller_id] || 0) + 1;
        });
        setProductCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, email) => {
    setRemoving(id);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', message: `Seller ${email} removed successfully.` });
      fetchSellers();
    } catch (error) {
      setToast({ type: 'error', message: `Failed to remove seller ${email}.` });
      console.error('Remove seller error:', error);
    } finally {
      setRemoving(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Filter sellers by search
  const filteredSellers = sellers.filter(seller => {
    const q = search.toLowerCase();
    return (
      (seller.first_name + ' ' + seller.last_name).toLowerCase().includes(q) ||
      seller.email.toLowerCase().includes(q)
    );
  });

  // Confirmation dialog state
  const [confirm, setConfirm] = useState({ open: false, id: null, email: '' });

  const openSellerDetails = async (seller) => {
    setSelectedSeller(seller);
    setDetailsOpen(true);
    setDetailsLoading(true);
    setSellerProducts([]);
    setSellerRevenue(0);
    setSellerTotalSold(0);
    setProductRatings({});
    // Fetch products for this seller (include stock)
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, title, category, price, created_at, stock')
      .eq('seller_id', seller.id);
    if (prodErr) {
      setDetailsLoading(false);
      return;
    }
    setSellerProducts(products || []);
    // Fetch order items for this seller's products to calculate revenue and total sold
    let productIds = [];
    if (products && products.length > 0) {
      productIds = products.map(p => p.id);
      const { data: orderItems, error: orderErr } = await supabase
        .from('order_items')
        .select('product_id, quantity, price')
        .in('product_id', productIds);
      if (!orderErr && orderItems) {
        // Revenue = sum of price * quantity for all order items
        const revenue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSellerRevenue(revenue);
        // Total sold = sum of quantity for all order items
        const totalSold = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        setSellerTotalSold(totalSold);
        // Calculate sold per product
        const soldPerProduct = {};
        orderItems.forEach(item => {
          soldPerProduct[item.product_id] = (soldPerProduct[item.product_id] || 0) + item.quantity;
        });
        // Attach sold count to each product
        setSellerProducts(products.map(p => ({ ...p, sold: soldPerProduct[p.id] || 0 })));
      }
      // Fetch product ratings
      const { data: reviews, error: reviewsErr } = await supabase
        .from('product_reviews')
        .select('product_id, rating');
      if (!reviewsErr && reviews) {
        const ratings = {};
        productIds.forEach(pid => {
          const productReviews = reviews.filter(r => r.product_id === pid);
          if (productReviews.length > 0) {
            const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
            ratings[pid] = avg;
          } else {
            ratings[pid] = null;
          }
        });
        setProductRatings(ratings);
      }
    }
    setDetailsLoading(false);
  };

  // Compute overall seller rating (average of all product ratings with at least one rating)
  const ratedProducts = Object.values(productRatings).filter(r => r !== null && r !== undefined) as number[];
  const overallSellerRating = ratedProducts.length > 0 ? (ratedProducts.reduce((a, b) => a + b, 0) / ratedProducts.length) : null;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Sellers Management</h2>
        {/* Search bar */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search sellers by name or email..."
            className="input-field max-w-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold gradient-text">All Sellers</h3>
          </div>
          <div className="card-body overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Joined</th>
                  <th className="text-left py-2 px-4"># Products</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">Loading...</td></tr>
                ) : filteredSellers.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">No sellers found.</td></tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-sayebo-pink-50 transition-colors cursor-pointer" onClick={() => openSellerDetails(seller)}>
                      <td className="py-2 px-4 font-medium align-middle">{seller.first_name} {seller.last_name}</td>
                      <td className="py-2 px-4 align-middle">{seller.email}</td>
                      <td className="py-2 px-4 align-middle">{new Date(seller.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-4 align-middle text-center">{productCounts[seller.id] || 0}</td>
                      <td className="py-2 px-4 align-middle text-center" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-outline text-red-600 flex items-center justify-center gap-2 mx-auto"
                          style={{ minWidth: 100 }}
                          disabled={removing === seller.id}
                          onClick={() => setConfirm({ open: true, id: seller.id, email: seller.email })}
                        >
                          <Trash2 className="w-4 h-4" />
                          {removing === seller.id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Seller Details Modal */}
        {detailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full relative md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setDetailsOpen(false)}>&times;</button>
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="loader mb-4"></div>
                  <span className="text-gray-500">Loading seller details...</span>
                </div>
              ) : (
                <>
                  <div className="w-full mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Box 1: Seller Profile */}
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center border border-sayebo-pink-100">
                      <div className="text-xs text-gray-500 font-medium uppercase mb-1">Seller Profile</div>
                      <div className="text-xl font-bold gradient-text mb-1 text-center">{selectedSeller.first_name} {selectedSeller.last_name}</div>
                      <div className="text-sm text-gray-700 mb-1 text-center">{selectedSeller.email}</div>
                      <div className="text-xs text-gray-500">Joined: {new Date(selectedSeller.created_at).toLocaleDateString()}</div>
                    </div>
                    {/* Box 2: Inventory & Stock */}
                    <div className="bg-sayebo-pink-50 rounded-xl shadow p-5 flex flex-col items-center justify-center border border-sayebo-pink-100">
                      <div className="text-xs text-gray-500 font-medium uppercase mb-1">Inventory & Stock</div>
                      <div className="flex flex-col items-center gap-2">
                        <div>
                          <span className="text-lg font-bold text-sayebo-pink-600">{sellerProducts.length}</span>
                          <span className="text-xs text-gray-500 ml-1">Products</span>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-blue-600">{sellerTotalSold}</span>
                          <span className="text-xs text-gray-500 ml-1">Sold</span>
                        </div>
                      </div>
                    </div>
                    {/* Box 3: Revenue & Rating */}
                    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center border border-sayebo-pink-100">
                      <div className="text-xs text-gray-500 font-medium uppercase mb-1">Revenue & Rating</div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-lg font-bold text-green-600">R{sellerRevenue.toLocaleString()}</div>
                        <div className="flex items-center gap-1">
                          {overallSellerRating !== null ? (
                            <>
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold text-gray-700 text-lg">{overallSellerRating.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-lg">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 mt-6">Products</h4>
                  {sellerProducts.length === 0 ? (
                    <div className="text-gray-400">No products found for this seller.</div>
                  ) : (
                    <div className="w-full">
                      <table className="w-full bg-sayebo-pink-50 rounded-xl shadow border border-sayebo-pink-100 text-sm md:text-base">
                        <thead>
                          <tr>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Name</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Category</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Price</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Stock</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Sold</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Stock Left</th>
                            <th className="py-3 px-4 text-left font-semibold text-sayebo-pink-700">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerProducts.map(product => (
                            <tr key={product.id} className="hover:bg-sayebo-pink-100/60 transition-colors">
                              <td className="py-2 px-4 font-medium align-middle">{product.title}</td>
                              <td className="py-2 px-4 align-middle">{product.category}</td>
                              <td className="py-2 px-4 align-middle">R{product.price?.toLocaleString()}</td>
                              <td className="py-2 px-4 align-middle">{product.stock ?? '-'}</td>
                              <td className="py-2 px-4 align-middle">{product.sold ?? 0}</td>
                              <td className="py-2 px-4 align-middle">{product.stock !== undefined ? (product.stock - (product.sold ?? 0)) : '-'}</td>
                              <td className="py-2 px-4 align-middle flex items-center gap-1">
                                {productRatings[product.id] !== null && productRatings[product.id] !== undefined ? (
                                  <>
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                    <span className="font-semibold text-gray-700">{productRatings[product.id].toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {/* Confirmation Dialog */}
        {confirm.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-2 text-red-600">Remove Seller?</h3>
              <p className="mb-6">Are you sure you want to remove <span className="font-semibold">{confirm.email}</span>? This cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button className="btn-secondary" onClick={() => setConfirm({ open: false, id: null, email: '' })}>Cancel</button>
                <button
                  className="btn-primary bg-gradient-to-r from-red-500 to-orange-500"
                  onClick={() => {
                    setConfirm({ open: false, id: null, email: '' });
                    handleRemove(confirm.id, confirm.email);
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

export default AdminSellers; 