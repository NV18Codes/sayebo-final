
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { SellerHeader } from '../components/SellerHeader';
import { SellerSidebar } from '../components/SellerSidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Menu } from 'lucide-react';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not a seller
  if (profile && profile.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  // If profile is still loading but user exists, show loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <SellerHeader />
      
      <div className="flex pt-16">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none pt-16
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <SellerSidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          {/* Mobile menu button */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
