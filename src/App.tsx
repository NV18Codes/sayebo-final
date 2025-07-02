import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import SellerDashboard from "./pages/seller/SellerDashboard";
import Products from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import Orders from "./pages/seller/Orders";
import Analytics from "./pages/seller/Analytics";
import Settings from "./pages/seller/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSellers from './pages/AdminSellers';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<ProductListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderTracking />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Seller Routes */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/seller-dashboard/products" element={<Products />} />
            <Route path="/seller-dashboard/add-product" element={<AddProduct />} />
            <Route path="/seller-dashboard/orders" element={<Orders />} />
            <Route path="/seller-dashboard/analytics" element={<Analytics />} />
            <Route path="/seller-dashboard/settings" element={<Settings />} />
            <Route path="/seller" element={<SellerDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
