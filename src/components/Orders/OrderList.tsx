import React from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { marketplace } from '../../lib/api/marketplace';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface Order {
  id: string;
  hash_power: number;
  price_per_th: number;
  total_price: number;
  status: string;
  start_time: string;
  end_time: string;
  hash_power_listings: {
    algorithm: string;
    seller_profiles: {
      business_name: string;
    };
  };
}

export function OrderList({ orders, loading }: { orders: Order[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-12 bg-gray-900/50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">
                {order.hash_power_listings.algorithm} - {order.hash_power} TH/s
              </h3>
              <p className="text-gray-400">
                {order.hash_power_listings.seller_profiles.business_name}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              order.status === 'active' ? 'bg-green-500/10 text-green-400' :
              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
              order.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Price per TH/s</p>
              <p className="text-white font-medium">${order.price_per_th}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Price</p>
              <p className="text-white font-medium">${order.total_price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Start Time</p>
              <p className="text-white font-medium">
                {new Date(order.start_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">End Time</p>
              <p className="text-white font-medium">
                {new Date(order.end_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {new Date(order.start_time).toLocaleDateString()}
            </div>
            <button className="text-primary hover:text-primary/80 text-sm">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}