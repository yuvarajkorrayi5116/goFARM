import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, ShoppingCart, Search, Filter, Calendar, Star, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCategory, Product } from '../../types';

export const ConsumerDashboard: React.FC = () => {
  const { products, addToCart } = useStore();
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

  // Filter Logic (Simulating PHP/SQL query)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, maxPrice]);

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const handleAddToCartFromModal = () => {
    if (selectedProduct) {
        addToCart(selectedProduct, 1);
        closeProductDetails();
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header & Mobile Cart */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fresh from the Farm</h1>
          <p className="text-gray-500 mt-1">Directly from farmers to your table</p>
        </div>
        <button 
          onClick={() => navigate('/consumer/cart')}
          className="md:hidden flex items-center space-x-2 bg-farm-600 text-white px-4 py-2 rounded-lg"
        >
          <ShoppingCart size={20} />
          <span>View Cart</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-farm-500 outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Category Filter */}
        <div className="relative">
             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
             <select 
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-farm-500 outline-none bg-white appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
             >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
        </div>

        {/* Price Slider */}
        <div className="flex flex-col justify-center">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Max Price</span>
                <span className="font-bold text-farm-700">₹{maxPrice}</span>
            </div>
            <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={maxPrice} 
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-farm-600"
            />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => openProductDetails(product)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-farm-800 shadow-sm">
                    {product.quantity > 0 ? `${product.quantity} left` : 'Sold Out'}
                  </span>
                  {product.isPreOrder && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
                          <Calendar size={12} className="mr-1"/> Pre-Order
                      </span>
                  )}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] uppercase font-bold tracking-wider">
                  {product.category}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-xs text-farm-600 font-semibold mb-1 uppercase tracking-wider">{product.farmerName}</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
              <div className="flex items-center space-x-1 mb-2">
                 <Star size={12} className="text-yellow-400 fill-current" />
                 <span className="text-xs text-gray-600 font-bold">{product.rating || 'New'}</span>
                 <span className="text-xs text-gray-400">({product.reviews?.length || 0})</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
              
              {product.isPreOrder && product.availableDate && (
                  <p className="text-xs text-orange-600 font-medium mb-3 bg-orange-50 p-2 rounded border border-orange-100">
                      Available on: <span className="font-bold">{product.availableDate}</span>
                  </p>
              )}

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                <button
                  disabled={product.quantity === 0}
                  onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                  }}
                  className={`p-2 rounded-full transition ${
                    product.quantity > 0 
                      ? 'bg-farm-100 text-farm-600 hover:bg-farm-600 hover:text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  title={product.isPreOrder ? "Pre-order this item" : "Add to cart"}
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products found matching your filters.</p>
          <button 
             onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(1000);}}
             className="mt-4 text-farm-600 font-bold hover:underline"
          >
              Clear Filters
          </button>
        </div>
      )}

      {/* Product Detail Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative">
                <button 
                    onClick={closeProductDetails}
                    className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 rounded-full z-10 transition"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                     <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                     />
                     <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white md:hidden">
                        <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                     </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                    <div className="hidden md:block">
                        <p className="text-sm text-farm-600 font-bold uppercase tracking-wider mb-1">{selectedProduct.category}</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                    </div>

                    <div className="flex items-center space-x-2 mb-4 bg-yellow-50 px-3 py-1.5 rounded-lg w-fit">
                         <Star className="text-yellow-500 fill-current" size={18} />
                         <span className="font-bold text-gray-800">{selectedProduct.rating || 'New'}</span>
                         <span className="text-gray-500 text-sm">({selectedProduct.reviews?.length || 0} reviews)</span>
                    </div>

                    <p className="text-gray-600 mb-6 flex-grow">{selectedProduct.description}</p>

                    <div className="mb-6 border-t border-b border-gray-100 py-4">
                        <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
                            <User size={16} className="mr-2 text-farm-500"/> Farmer Details
                        </h4>
                        <p className="text-sm text-gray-600">Listed by <span className="font-semibold text-gray-900">{selectedProduct.farmerName}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Verified Organic Producer</p>
                    </div>

                     {/* Reviews Preview (Top 2) */}
                     {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
                        <div className="mb-6">
                             <h4 className="font-bold text-sm text-gray-800 mb-3">Recent Reviews</h4>
                             <div className="space-y-3">
                                 {selectedProduct.reviews.slice(0, 2).map(review => (
                                     <div key={review.id} className="text-xs bg-gray-50 p-2 rounded">
                                         <div className="flex justify-between font-semibold mb-1">
                                             <span>{review.userName}</span>
                                             <div className="flex text-yellow-500">
                                                 {[...Array(review.rating)].map((_, i) => <Star key={i} size={8} fill="currentColor"/>)}
                                             </div>
                                         </div>
                                         <p className="text-gray-600 italic">"{review.comment}"</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                     )}

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                             <span className="block text-xs text-gray-500">Price per unit</span>
                             <span className="text-3xl font-bold text-farm-800">₹{selectedProduct.price}</span>
                        </div>
                        <button 
                            onClick={handleAddToCartFromModal}
                            disabled={selectedProduct.quantity === 0}
                            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95 ${
                                selectedProduct.quantity > 0 
                                ? 'bg-farm-600 text-white hover:bg-farm-700' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {selectedProduct.quantity > 0 ? (selectedProduct.isPreOrder ? 'Pre-Order Now' : 'Add to Cart') : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};