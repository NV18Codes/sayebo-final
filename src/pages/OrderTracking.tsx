
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface OrderStatus {
  id: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId, navigate]);

  const fetchOrderDetails = async () => {
    if (!user || !orderId) return;

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order status history
      const { data: statusData, error: statusError } = await supabase
        .from('order_status')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (statusError) {
        console.error('Error fetching order status:', statusError);
        // Don't throw error for order status, it might not exist yet
      } else {
        setOrderStatuses(statusData || []);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
        <Header />
        <main className="pt-20">
          <ResponsiveContainer className="py-8">
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
              <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
              <button
                onClick={() => navigate('/orders')}
                className="bg-sayebo-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sayebo-pink-600 transition-colors"
              >
                View All Orders
              </button>
            </div>
          </ResponsiveContainer>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <Header />
      <main className="pt-20">
        <ResponsiveContainer className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Package className="w-8 h-8 text-sayebo-pink-500" />
              Order Tracking
            </h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-sayebo-pink-500">
                      R{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  {order.shipping_address && (
                    <div>
                      <span className="text-gray-600 block mb-2">Shipping Address:</span>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-sm">{order.shipping_address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Timeline</h2>
                
                {orderStatuses.length > 0 ? (
                  <div className="space-y-6">
                    {orderStatuses.map((status, index) => (
                      <div key={status.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(status.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-800 capitalize">
                              {status.status}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {new Date(status.created_at).toLocaleString()}
                            </span>
                          </div>
                          {status.description && (
                            <p className="text-gray-600 text-sm">{status.description}</p>
                          )}
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className="absolute left-3 mt-8 w-px h-6 bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Order Status Pending</h3>
                    <p className="text-gray-600">Your order is being processed. Status updates will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default OrderTracking;
