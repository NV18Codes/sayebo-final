
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminStats } from '../components/AdminStats';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product';
  message: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, profile, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate recent activity for now
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'order',
          message: 'New order #ORD-2024-001 received for R1,250',
          timestamp: '2 minutes ago'
        },
        {
          id: '2',
          type: 'user',
          message: 'New user registration: john.doe@email.com',
          timestamp: '15 minutes ago'
        },
        {
          id: '3',
          type: 'product',
          message: 'Product "Samsung Galaxy S24" updated by seller',
          timestamp: '1 hour ago'
        },
        {
          id: '4',
          type: 'order',
          message: 'Order #ORD-2024-002 shipped to Cape Town',
          timestamp: '2 hours ago'
        }
      ];
      
      setRecentActivity(mockActivity);
    } catch (error) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-300 border-t-transparent"></div>
          <p className="mt-4 text-red-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Admin!</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Profile */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.first_name} {profile?.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Stats */}
            <AdminStats />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'order' ? 'bg-green-400' :
                            activity.type === 'user' ? 'bg-blue-400' : 'bg-purple-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                      Add New Product
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Manage Users
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      View Reports
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      System Settings
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">System Status</h3>
                  <p className="text-red-100 text-sm mb-4">All systems operational</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Server Health</span>
                      <span className="text-green-300">●</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Database</span>
                      <span className="text-green-300">●</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Gateway</span>
                      <span className="text-green-300">●</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
