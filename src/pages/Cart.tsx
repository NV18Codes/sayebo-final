
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-pink-400 font-medium">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="pt-20 max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/products"
              className="btn-primary"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop'}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.title}</h3>
                    <p className="text-lg font-bold text-pink-400 mt-1">
                      R{item.product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      In stock: {item.product.stock}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">R{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `R${shipping}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (15%)</span>
                <span className="font-medium">R{tax.toFixed(2)}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-pink-400">R{total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-4 p-3 bg-peach-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Add R{(500 - subtotal).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            <Link
              to="/checkout"
              className="w-full btn-primary mt-6 block text-center"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/products"
              className="w-full btn-secondary mt-3 block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
