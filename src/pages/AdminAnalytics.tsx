import React from 'react';
import { AdminLayout } from '../layouts/AdminLayout';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Analytics</h2>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Products Sold by Category</h3>
          {/* TODO: Insert chart or table here */}
          <div className="h-32 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700">Total Revenue</span>
            <span className="text-2xl font-bold text-green-600 mt-2">R0.00</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700">Orders Placed</span>
            <span className="text-2xl font-bold text-blue-600 mt-2">0</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700">Orders Delivered</span>
            <span className="text-2xl font-bold text-purple-600 mt-2">0</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700">Orders Cancelled</span>
            <span className="text-2xl font-bold text-red-600 mt-2">0</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics; 