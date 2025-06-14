
import React, { useState, useEffect } from 'react';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { DataTable } from '../../components/ui/data-table';
import { StatusBadge } from '../../components/ui/status-badge';
import { Button } from '../../components/ui/button';
import { ShoppingBag, Eye, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_count: number;
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
          profiles!inner(first_name, last_name),
          order_items!inner(
            quantity,
            products!inner(seller_id)
          )
        `)
        .eq('order_items.products.seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        id: order.id,
        customer_name: `${order.profiles.first_name} ${order.profiles.last_name}`,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items_count: order.order_items.length,
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

  const orderColumns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order: Order) => (
        <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (order: Order) => (
        <span className="font-medium">{order.customer_name}</span>
      ),
    },
    {
      key: 'items_count',
      header: 'Items',
      render: (order: Order) => (
        <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total',
      render: (order: Order) => (
        <span className="font-semibold">R{order.total_amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => {
        const variant = order.status === 'completed' ? 'success' : 
                      order.status === 'pending' ? 'warning' : 'info';
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
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Truck className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SellerLayout>
      <PageHeader 
        title="Orders"
        description="Manage and track your orders"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable
          data={orders}
          columns={orderColumns}
          loading={loading}
          emptyMessage="No orders found."
        />
      </div>
    </SellerLayout>
  );
};

export default Orders;
