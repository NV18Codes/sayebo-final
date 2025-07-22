
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Settings,
  Users,
  MessageCircle,
  FileText,
  X,
  StarIcon
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/seller-dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/seller-dashboard/products', icon: Package },
  { name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingBag },
  { name: 'Analytics', href: '/seller-dashboard/analytics', icon: TrendingUp },
  { name: 'Customers', href: '/seller-dashboard/customer', icon: Users },
  { name: 'Review & Ratings', href: '/seller-dashboard/review&rating', icon: StarIcon },
  { name: 'Reports', href: '/seller-dashboard/report', icon: FileText },
  { name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
];

interface SellerSidebarProps {
  onClose?: () => void;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({ onClose }) => {
  const location = useLocation();

  return (
<aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-inner border-r border-gray-200 overflow-y-auto z-30">
      <div className="flex flex-col h-full">
        {/* Mobile close button */}
        {onClose && (
          <div className="lg:hidden flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold gradient-text">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Desktop header */}
        <div className="hidden lg:block px-6 py-6">
          <h2 className="text-lg font-semibold gradient-text">Seller Tools</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/seller-dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sayebo-pink-100 to-sayebo-orange-100 text-sayebo-pink-700 shadow-sm'
                    : 'text-gray-600 hover:text-sayebo-pink-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-sayebo-pink-600' : 'text-gray-400'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-sayebo-pink-50 to-sayebo-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Need help?</p>
            <Link 
              to="/contact" 
              onClick={onClose}
              className="text-sm text-sayebo-pink-600 hover:text-sayebo-pink-700 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
