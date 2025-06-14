
import React from 'react';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { StatsCard } from '../../components/ui/stats-card';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <SellerLayout>
      <PageHeader 
        title="Analytics"
        description="Track your sales performance and insights"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Revenue This Month"
          value="R25,430"
          change={{ value: 12.5, trend: 'up' }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Orders This Month"
          value="143"
          change={{ value: 8.2, trend: 'up' }}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          title="Conversion Rate"
          value="3.2%"
          change={{ value: 0.4, trend: 'up' }}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Active Customers"
          value="1,234"
          change={{ value: 5.1, trend: 'up' }}
          icon={Users}
          color="pink"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Sales chart will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Product Analytics</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Analytics;
