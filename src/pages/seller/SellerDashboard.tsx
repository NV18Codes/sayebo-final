
import React, { useState, useEffect } from 'react';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { StatsCard } from '../../components/ui/stats-card';
import { DataTable } from '../../components/ui/data-table';
import { StatusBadge } from '../../components/ui/status-badge';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch products count
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user.id);

      if (productsError) throw productsError;

      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles!inner(first_name, last_name),
          order_items!inner(
            product_id,
            products!inner(seller_id)
          )
        `)
        .eq('order_items.products.seller_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;
      const uniqueCustomers = new Set(orders?.map(order => `${order.profiles.first_name} ${order.profiles.last_name}`)).size;

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers: uniqueCustomers,
        revenueChange: 12.5, // Mock data for demo
        ordersChange: 8.2,   // Mock data for demo
      });

      // Format recent orders
      const formattedOrders = orders?.slice(0, 5).map(order => ({
        id: order.id,
        customer_name: `${order.profiles.first_name} ${order.profiles.last_name}`,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      })) || [];

      setRecentOrders(formattedOrders);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order: RecentOrder) => (
        <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (order: RecentOrder) => (
        <span className="font-medium">{order.customer_name}</span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Amount',
      render: (order: RecentOrder) => (
        <span className="font-semibold">R{order.total_amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: RecentOrder) => {
        const variant = order.status === 'completed' ? 'success' : 
                      order.status === 'pending' ? 'warning' : 'info';
        return <StatusBadge status={order.status} variant={variant} />;
      },
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (order: RecentOrder) => (
        <span className="text-sm text-gray-600">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <SellerLayout>
      <PageHeader 
        title="Dashboard Overview"
        description="Monitor your store performance and recent activity"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`R${stats.totalRevenue.toLocaleString()}`}
          change={{ value: stats.revenueChange, trend: 'up' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={{ value: stats.ordersChange, trend: 'up' }}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="pink"
        />
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <a 
            href="/seller-dashboard/orders" 
            className="text-sayebo-pink-600 hover:text-sayebo-pink-700 font-medium text-sm"
          >
            View all orders →
          </a>
        </div>
        
        <DataTable
          data={recentOrders}
          columns={orderColumns}
          loading={loading}
          emptyMessage="No orders yet"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a 
              href="/seller-dashboard/products" 
              className="block p-3 rounded-lg bg-gradient-to-r from-sayebo-pink-50 to-sayebo-orange-50 hover:from-sayebo-pink-100 hover:to-sayebo-orange-100 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-sayebo-pink-600" />
                <span className="font-medium text-gray-800">Add New Product</span>
              </div>
            </a>
            <a 
              href="/seller-dashboard/orders" 
              className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Manage Orders</span>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium">R{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 h-2 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              +{stats.revenueChange}% from last month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Store Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Products Active</span>
              <span className="text-sm font-medium text-green-600">{stats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Orders</span>
              <span className="text-sm font-medium text-yellow-600">
                {recentOrders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-green-600">98%</span>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
