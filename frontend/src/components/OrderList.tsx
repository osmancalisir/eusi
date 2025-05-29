// src/components/OrderList.tsx

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p className="text-gray-500">No orders yet</p>;

  return (
    <ul className="space-y-2">
      {orders.map(order => (
        <li key={order.id} className="border-b border-gray-200 pb-2">
          <div className="font-medium">Order #{order.id}</div>
          <div className="text-sm">
            {new Date(order.order_date).toLocaleDateString()} | 
            Image: {order.image_id}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
