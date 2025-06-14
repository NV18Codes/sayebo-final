
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="btn-primary"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-sayebo-pink-600">Home</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-sayebo-pink-600">Products</Link>
          <span>/</span>
          <span className="text-gray-800">Shopping Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link
            to="/marketplace"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image_url || '/placeholder.svg'}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{item.product.title}</h3>
                    <p className="text-lg font-bold text-sayebo-pink-500 mb-1">
                      R{item.product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      In stock: {item.product.stock}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Subtotal: R{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium bg-white min-w-[60px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span className="font-medium">R{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    `R${shipping}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>VAT (15%)</span>
                <span className="font-medium">R{tax.toFixed(2)}</span>
              </div>
              
              <hr className="my-4 border-gray-200" />
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-sayebo-pink-500">R{total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-sayebo-pink-50 to-sayebo-orange-50 rounded-lg border border-sayebo-pink-100">
                <p className="text-sm text-gray-700 text-center">
                  💡 Add <span className="font-semibold text-sayebo-pink-600">R{(500 - subtotal).toFixed(2)}</span> more for free shipping!
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
              to="/marketplace"
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
