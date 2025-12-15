import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Trash2, ArrowRight, CheckCircle, AlertCircle, MapPin, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, orders } = useStore();
  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  // Simple "Payment Gateway" simulation
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate Random Payment Success/Failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      placeOrder(address);
      setOrderSuccess(true);
    } else {
      alert("Payment Failed! Please try again.");
    }
    setIsOrdering(false);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl shadow-lg mt-10 p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-8">Your fresh products will be on their way soon.</p>
        <button onClick={() => navigate('/consumer')} className="bg-farm-600 text-white px-6 py-3 rounded-lg hover:bg-farm-700 transition w-full">
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 relative">
        <button 
             onClick={() => navigate('/consumer')} 
             className="absolute top-0 left-0 flex items-center text-gray-500 hover:text-farm-600 transition"
        >
             <ArrowLeft size={20} className="mr-2" /> Back to Shop
        </button>

        <div className="inline-block p-6 bg-gray-100 rounded-full mb-4 mt-8">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any fresh produce yet.</p>
        <button onClick={() => navigate('/consumer')} className="bg-farm-600 text-white px-6 py-3 rounded-lg hover:bg-farm-700 transition">
          Browse Products
        </button>
        
        {/* Show order history if exists */}
        {orders.length > 0 && (
            <div className="mt-12 text-left bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Your Recent Orders</h3>
                {orders.map(order => (
                    <div key={order.id} className="py-3 flex justify-between items-center border-b last:border-0">
                        <div>
                            <span className="font-bold">Order #{order.id.slice(-4)}</span>
                            <span className="text-sm text-gray-500 block">{order.items.length} items • {order.status}</span>
                        </div>
                        <span className="font-bold">₹{order.totalAmount + (order.deliveryCost || 0)}</span>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button 
           onClick={() => navigate('/consumer')} 
           className="flex items-center text-gray-500 hover:text-farm-600 transition font-medium"
      >
           <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart ({cart.length} items)</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {cart.map(item => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4 mb-4 sm:mb-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.farmerName}</p>
                  
                  {/* Quantity Customization */}
                  <div className="flex items-center mt-3">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-600 disabled:opacity-50"
                        disabled={item.cartQuantity <= 1}
                      >
                          <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-800">{item.cartQuantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-600 disabled:opacity-50"
                        disabled={item.quantity <= item.cartQuantity} // Disable if exceeds stock
                      >
                          <Plus size={14} />
                      </button>
                      <span className="text-xs text-gray-400 ml-3">
                          Available: {item.quantity}
                      </span>
                  </div>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="font-bold text-lg">₹{item.price * item.cartQuantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:text-red-700 mt-2 flex items-center justify-end w-full sm:w-auto"
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Calculated later</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total to Pay</span>
                <span>₹{total}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin size={16} className="mr-1" /> Delivery Address
                </label>
                <textarea 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-500 outline-none"
                  rows={3}
                  placeholder="Enter your full address..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={isOrdering}
                className={`w-full py-3 rounded-lg text-white font-bold shadow-md flex items-center justify-center space-x-2 ${
                  isOrdering ? 'bg-gray-400 cursor-wait' : 'bg-farm-600 hover:bg-farm-700'
                }`}
              >
                {isOrdering ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Checkout</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};