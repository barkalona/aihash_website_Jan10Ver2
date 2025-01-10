import React from 'react';
import { ArrowLeft, Clock, Cpu, Wallet, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface OrderDetailsProps {
  order: any;
  onBack: () => void;
  loading?: boolean;
}

export function OrderDetails({ order, onBack, loading }: OrderDetailsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      <div className="bg-gray-900/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Order Details</h2>
          <div className={`px-3 py-1 rounded-full text-sm ${
            order.status === 'active' ? 'bg-green-500/10 text-green-400' :
            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
            order.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Hash Power</h3>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">{order.hash_power} TH/s</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Algorithm</h3>
              <p className="text-lg font-medium">{order.hash_power_listings.algorithm}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Duration</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">
                  {Math.ceil((new Date(order.end_time).getTime() - new Date(order.start_time).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Price per TH/s</h3>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">${order.price_per_th}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Total Price</h3>
              <p className="text-lg font-medium">${order.total_price}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Payment Status</h3>
              <div className={`flex items-center gap-2 ${
                order.payment_status === 'completed' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                <AlertTriangle className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-lg font-medium mb-4">Order Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div>
                <p className="text-white">Order Created</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {order.status !== 'pending' && (
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div>
                  <p className="text-white">Mining Started</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.start_time).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {order.status === 'completed' && (
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <div>
                  <p className="text-white">Mining Completed</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.end_time).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}