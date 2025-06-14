
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, Camera, Shield, Package, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();
  const { profile, refetch } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    postal_code: profile?.postal_code || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      postal_code: profile?.postal_code || '',
    });
    setIsEditing(false);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 via-white to-sayebo-orange-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sayebo-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-sayebo-pink-500 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 via-white to-sayebo-orange-50">
      <Header />
      <main className="pt-24 max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === 'seller' 
                    ? 'bg-purple-100 text-purple-700' 
                    : profile.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {profile.role === 'seller' ? '🛍️ Seller' : profile.role === 'admin' ? '👑 Admin' : '🛒 Customer'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✅ Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-sayebo-pink-500" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                      {profile.first_name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                      {profile.last_name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all"
                      placeholder="+27 XX XXX XXXX"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {profile.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all resize-none"
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                      {profile.address || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                      {profile.city || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-sayebo-pink-400 transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                      {profile.postal_code || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-sayebo-pink-500" />
                    <span className="text-sm text-gray-600">Member since</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Orders</span>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">Wishlist Items</span>
                  </div>
                  <span className="text-sm font-medium">5</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/orders"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-sayebo-pink-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-600 group-hover:text-sayebo-pink-500" />
                    <span className="text-sm font-medium">View Orders</span>
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </a>
                <a
                  href="/wishlist"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-sayebo-pink-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-sayebo-pink-500" />
                    <span className="text-sm font-medium">Wishlist</span>
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </a>
                {profile.role === 'seller' && (
                  <a
                    href="/seller-dashboard"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600 group-hover:text-purple-500" />
                      <span className="text-sm font-medium">Seller Dashboard</span>
                    </div>
                    <span className="text-xs text-gray-400">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
