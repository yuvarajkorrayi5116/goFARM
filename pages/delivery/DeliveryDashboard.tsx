import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Order } from '../../types';
import { MapPin, Truck, Check, X, Navigation } from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { user, orders, updateDeliveryStatus } = useStore();
  
  // State for distance input per order
  const [distances, setDistances] = useState<Record<string, string>>({});

  // Filter orders
  // 1. Pending: Status is PENDING (No driver assigned or price set yet)
  // 2. My Deliveries: Assigned to current user and not delivered yet
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myDeliveries = orders.filter(o => o.deliveryId === user?.id && o.status !== OrderStatus.DELIVERED);
  const history = orders.filter(o => o.deliveryId === user?.id && o.status === OrderStatus.DELIVERED);

  const handleDistanceChange = (id: string, val: string) => {
    setDistances(prev => ({ ...prev, [id]: val }));
  };

  const handleAccept = (order: Order) => {
    const dist = parseFloat(distances[order.id]);
    if (!dist || dist <= 0) {
      alert("Please enter a valid distance in KM.");
      return;
    }
    updateDeliveryStatus(order.id, OrderStatus.ACCEPTED, user?.id, dist);
    // Clear input
    const newDistances = {...distances};
    delete newDistances[order.id];
    setDistances(newDistances);
  };

  const handleDeliver = (orderId: string) => {
    updateDeliveryStatus(orderId, OrderStatus.DELIVERED);
  };

  const OrderCard: React.FC<{ order: Order, type: 'pending' | 'active' | 'history' }> = ({ order, type }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order #{order.id.slice(-4)}</span>
          <h3 className="font-bold text-gray-800 text-lg">{order.consumerName}</h3>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
            order.status === OrderStatus.ACCEPTED ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
        }`}>
            {order.status}
        </div>
      </div>

      <div className="flex items-start space-x-2 text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
        <MapPin size={18} className="flex-shrink-0 mt-0.5 text-farm-600" />
        <p>{order.deliveryAddress}</p>
      </div>

      <div className="space-y-1 mb-4">
        {order.items.map(item => (
            <div key={item.id} className="text-xs text-gray-500 flex justify-between">
                <span>{item.name} x {item.cartQuantity}</span>
                <span>From: {item.farmerName}</span>
            </div>
        ))}
      </div>

      {type === 'pending' && (
        <div className="border-t pt-4 mt-4">
          <label className="block text-xs font-bold text-gray-500 mb-1">Enter Distance (KM)</label>
          <div className="flex space-x-2">
            <input 
              type="number" 
              placeholder="0.0" 
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-farm-500 outline-none"
              value={distances[order.id] || ''}
              onChange={(e) => handleDistanceChange(order.id, e.target.value)}
            />
            <button 
              onClick={() => handleAccept(order)}
              className="bg-farm-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-farm-700 transition"
            >
              Accept
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">* Rate: ₹5/km</p>
        </div>
      )}

      {type === 'active' && (
        <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between text-sm">
                <span>Distance: <span className="font-bold">{order.distanceKm} km</span></span>
                <span>Earnings: <span className="font-bold text-green-600">₹{order.deliveryCost}</span></span>
            </div>
            <button 
                onClick={() => handleDeliver(order.id)}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center justify-center space-x-2"
            >
                <Check size={18} />
                <span>Mark Delivered</span>
            </button>
        </div>
      )}

        {type === 'history' && (
             <div className="border-t pt-4 mt-4 flex justify-between text-sm">
                <span className="text-green-600 font-bold flex items-center"><Check size={14} className="mr-1"/> Completed</span>
                <span className="font-bold">Earned: ₹{order.deliveryCost}</span>
             </div>
        )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
          <Truck className="mr-3 text-farm-600" size={32} />
          Delivery Dashboard
        </h1>
        
        {/* Simple Tabs via Layout or just sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
                <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center">
                    <Navigation className="mr-2" size={20}/> New Requests ({pendingOrders.length})
                </h2>
                <div className="space-y-4">
                    {pendingOrders.length === 0 && <p className="text-gray-400 text-sm">No pending orders.</p>}
                    {pendingOrders.map(order => <OrderCard key={order.id} order={order} type="pending" />)}
                </div>
            </section>

            <section>
                <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center">
                    <Truck className="mr-2" size={20}/> My Deliveries ({myDeliveries.length})
                </h2>
                <div className="space-y-4">
                    {myDeliveries.length === 0 && <p className="text-gray-400 text-sm">No active deliveries.</p>}
                    {myDeliveries.map(order => <OrderCard key={order.id} order={order} type="active" />)}
                </div>

                {history.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-dashed">
                        <h2 className="font-bold text-lg text-gray-700 mb-4">Completed History</h2>
                         <div className="space-y-4 opacity-75 hover:opacity-100 transition">
                            {history.map(order => <OrderCard key={order.id} order={order} type="history" />)}
                        </div>
                    </div>
                )}
            </section>
        </div>
      </div>
    </div>
  );
};
