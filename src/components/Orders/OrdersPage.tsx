import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { marketplace } from '../../lib/api/marketplace';
import { OrderFilters } from './OrderFilters';
import { OrderList } from './OrderList';
import { OrderDetails } from './OrderDetails';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'date_desc'
  });

  useEffect(() => {
    loadOrders();
  }, [user, filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await marketplace.getUserOrders(user!.id);
      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          order.hash_power_listings.algorithm.toLowerCase().includes(searchLower) ||
          order.hash_power_listings.seller_profiles.business_name.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_asc':
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        case 'date_desc':
          return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
        case 'price_asc':
          return a.total_price - b.total_price;
        case 'price_desc':
          return b.total_price - a.total_price;
        case 'hash_power_desc':
          return b.hash_power - a.hash_power;
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <div className="text-gray-400">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </div>
        </div>

        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
          />
        ) : (
          <>
            <OrderFilters
              filters={filters}
              onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
            />
            <OrderList
              orders={filteredOrders}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}