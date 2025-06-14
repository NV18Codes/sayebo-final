
import React from 'react';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { Button } from '../../components/ui/button';
import { Settings as SettingsIcon, Store, Bell, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <SellerLayout>
      <PageHeader 
        title="Settings"
        description="Manage your seller account and preferences"
      />

      <div className="space-y-6">
        {/* Store Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Store className="w-5 h-5 text-sayebo-pink-600" />
            <h3 className="text-lg font-semibold text-gray-800">Store Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sayebo-pink-500 focus:border-transparent"
                placeholder="Your store name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sayebo-pink-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your store"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-sayebo-pink-600" />
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Order notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Low stock alerts</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Marketing updates</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-5 h-5 text-sayebo-pink-600" />
            <h3 className="text-lg font-semibold text-gray-800">Payment Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sayebo-pink-500 focus:border-transparent"
                placeholder="Account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sayebo-pink-500 focus:border-transparent"
                placeholder="Your tax number"
              />
            </div>
            <Button>Update Payment Info</Button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Settings;
