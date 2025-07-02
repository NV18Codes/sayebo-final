import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { AdminSidebar } from '../components/AdminSidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Bell, Search, User, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not an admin
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If profile is still loading but user exists, show loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Welcome, {profile?.first_name} {profile?.last_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Logout Icon */}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </div>
          </div>
        </header>
        {/* Main children content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}; 