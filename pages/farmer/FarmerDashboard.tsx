import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, ProductCategory } from '../../types';
import { Package, Plus, DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user, products, addProduct, orders } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
    category: 'Vegetables' as ProductCategory,
    isPreOrder: false,
    availableDate: ''
  });

  const myProducts = products.filter(p => p.farmerId === user?.id);
  const myOrders = orders.filter(o => o.items.some(item => item.farmerId === user?.id));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      quantity: Number(newProduct.quantity),
      description: newProduct.description,
      imageUrl: newProduct.imageUrl,
      category: newProduct.category,
      isPreOrder: newProduct.isPreOrder,
      availableDate: newProduct.isPreOrder ? newProduct.availableDate : undefined
    });
    setIsAdding(false);
    // Reset form
    setNewProduct({
      name: '', price: '', quantity: '', description: '', 
      imageUrl: `https://picsum.photos/300/300?random=${Date.now()}`,
      category: 'Vegetables', isPreOrder: false, availableDate: ''
    });
  };

  const categories: ProductCategory[] = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{myProducts.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Orders Received</p>
            <p className="text-2xl font-bold">{myOrders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Delivery</p>
            <p className="text-2xl font-bold">{myOrders.filter(o => o.status === OrderStatus.PENDING).length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">My Products</h2>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center space-x-2 bg-farm-600 text-white px-4 py-2 rounded-lg hover:bg-farm-700 transition"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>

          {isAdding && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-farm-200 animate-fade-in-down">
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input required type="text" className="w-full mt-1 px-3 py-2 border rounded-md" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-white"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as ProductCategory})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input required type="number" className="w-full mt-1 px-3 py-2 border rounded-md" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity (kg/unit)</label>
                  <input required type="number" className="w-full mt-1 px-3 py-2 border rounded-md" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} />
                </div>

                {/* Pre-order Section */}
                <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <input 
                      type="checkbox" 
                      id="preOrder" 
                      className="w-4 h-4 text-farm-600 rounded"
                      checked={newProduct.isPreOrder}
                      onChange={e => setNewProduct({...newProduct, isPreOrder: e.target.checked})}
                    />
                    <label htmlFor="preOrder" className="font-bold text-gray-800 flex items-center">
                      <Clock size={16} className="mr-1"/> Enable Pre-Order
                    </label>
                  </div>
                  
                  {newProduct.isPreOrder && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Availability Date</label>
                      <input 
                        required={newProduct.isPreOrder}
                        type="date" 
                        className="w-full px-3 py-2 border rounded-md"
                        value={newProduct.availableDate}
                        onChange={e => setNewProduct({...newProduct, availableDate: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">Consumers can book this item now, to be delivered after this date.</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea className="w-full mt-1 px-3 py-2 border rounded-md" rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-farm-600 text-white rounded-md hover:bg-farm-700">Save Product</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No products listed yet.</td>
                  </tr>
                ) : (
                  myProducts.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover mr-3" />
                        <div>
                          <span className="font-medium text-gray-900 block">{p.name}</span>
                          {p.isPreOrder && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center w-fit">
                                <Calendar size={10} className="mr-1"/> {p.availableDate}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{p.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{p.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h3 className="font-bold text-gray-700">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {myOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No orders yet.</div>
            ) : (
              myOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500">Order #{order.id.slice(-4)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{order.status}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">Customer: {order.consumerName}</div>
                  <div className="space-y-1">
                    {order.items.filter(i => i.farmerId === user?.id).map(item => (
                      <div key={item.id} className="text-xs text-gray-600 flex justify-between">
                        <span>{item.name} x {item.cartQuantity}</span>
                        <span>₹{item.price * item.cartQuantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};