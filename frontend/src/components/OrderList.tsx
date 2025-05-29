// src/components/OrderList.tsx

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/orders`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load orders');
        console.error('Order fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#840032]"></div>
  </div>;

  if (orders.length === 0) return <p className="text-gray-500 py-4 text-center">No orders yet</p>;

  return (
    <ul className="space-y-2 max-h-60 overflow-y-auto">
      {orders.map(order => (
        <li key={order.id} className="border-b border-gray-200 pb-2 last:border-0">
          <div className="font-medium">Order #{order.id}</div>
          <div className="text-sm flex justify-between">
            <span>{new Date(order.order_date).toLocaleDateString()}</span>
            <span className="text-[#002642]">Image: {order.image_id}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
