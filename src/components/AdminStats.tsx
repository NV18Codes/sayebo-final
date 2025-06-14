
import React from 'react';
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, changeType, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-2">
          {changeType === 'increase' ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const AdminStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 'R2.4M',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Total Users',
      value: '45,230',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Total Products',
      value: '12,543',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Orders Today',
      value: '1,247',
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: <ShoppingCart className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
