
import React, { useState, useEffect } from 'react';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { DataTable } from '../../components/ui/data-table';
import { StatusBadge } from '../../components/ui/status-badge';
import { Button } from '../../components/ui/button';
import { Package, Eye, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          shipping_address,
          profiles!inner(first_name, last_name, email),
          order_items!inner(
            product_id,
            products!inner(seller_id)
          )
        `)
        .eq('order_items.products.seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        id: order.id,
        customer_name: `${order.profiles.first_name} ${order.profiles.last_name}`,
        customer_email: order.profiles.email,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        shipping_address: order.shipping_address || 'No address provided',
      })) || [];

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      fetchOrders(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const orderColumns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order: Order) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
        </div>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (order: Order) => (
        <div>
          <div className="font-medium">{order.customer_name}</div>
          <div className="text-sm text-gray-500">{order.customer_email}</div>
        </div>
      ),
    },
    {
      key: 'total_amount',
      header: 'Amount',
      render: (order: Order) => (
        <span className="font-semibold">R{order.total_amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => {
        const variant = order.status === 'completed' ? 'success' : 
                      order.status === 'pending' ? 'warning' : 
                      order.status === 'processing' ? 'info' : 'default';
        return <StatusBadge status={order.status} variant={variant} />;
      },
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (order: Order) => (
        <span className="text-sm text-gray-600">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="View Details">
            <Eye className="w-4 h-4" />
          </Button>
          {order.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="sm" 
              title="Mark as Processing"
              onClick={() => updateOrderStatus(order.id, 'processing')}
            >
              <Truck className="w-4 h-4 text-blue-500" />
            </Button>
          )}
          {order.status === 'processing' && (
            <Button 
              variant="ghost" 
              size="sm" 
              title="Mark as Shipped"
              onClick={() => updateOrderStatus(order.id, 'shipped')}
            >
              <Truck className="w-4 h-4 text-green-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <SellerLayout>
      <PageHeader 
        title="Orders"
        description="Manage your customer orders and fulfillment"
      />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Processing</div>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable
          data={orders}
          columns={orderColumns}
          loading={loading}
          emptyMessage="No orders found. Orders will appear here when customers make purchases."
        />
      </div>
    </SellerLayout>
  );
};

export default Orders;
