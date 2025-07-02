import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { StatsCard } from '../components/ui/stats-card';
import { Users, Package, ShoppingCart, UserCheck, Eye } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    sellers: 0,
    users: 0,
    products: 0,
    visitors: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  // Visitor counter using localStorage
  useEffect(() => {
    let visitors = Number(localStorage.getItem('sayebo_admin_visitors') || '0');
    visitors += 1;
    localStorage.setItem('sayebo_admin_visitors', visitors.toString());
    setStats((prev) => ({ ...prev, visitors }));
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch sellers (role = 'seller')
      const { data: sellers, error: sellersError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('role', 'seller');
      console.log('Dashboard sellers:', sellers);
      if (sellersError) throw sellersError;

      // Fetch users (role = 'buyer')
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('role', 'buyer');
      console.log('Dashboard users:', users);
      if (usersError) throw usersError;

      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id');
      if (productsError) throw productsError;

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id');
      if (ordersError) throw ordersError;

      setStats((prev) => ({
        ...prev,
        sellers: sellers ? sellers.length : 0,
        users: users ? users.length : 0,
        products: products ? products.length : 0,
        orders: orders ? orders.length : 0,
      }));
    } catch (error) {
      // Optionally show a toast or error message
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen gradient-bg py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold gradient-text mb-8">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <StatsCard
              title="Sellers"
              value={loading ? '...' : stats.sellers}
              icon={UserCheck}
              color="orange"
            />
            <StatsCard
              title="Users"
              value={loading ? '...' : stats.users}
              icon={Users}
              color="pink"
            />
            <StatsCard
              title="Products"
              value={loading ? '...' : stats.products}
              icon={Package}
              color="purple"
            />
            <StatsCard
              title="Visitors"
              value={stats.visitors}
              icon={Eye}
              color="green"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold gradient-text">Total Orders</h3>
              </div>
              <div className="card-body flex items-center justify-center">
                <span className="text-4xl font-bold text-sayebo-pink-600">{loading ? '...' : stats.orders}</span>
              </div>
            </div>
            {/* You can add more widgets or charts here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
