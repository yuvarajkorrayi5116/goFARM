import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, UserRole, OrderStatus, CartItem, ProductCategory } from '../types';

interface StoreContextType {
  user: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  
  // Auth Actions
  login: (email: string, role: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole) => boolean;
  logout: () => void;
  
  // Farmer Actions
  addProduct: (product: Omit<Product, 'id' | 'farmerId' | 'farmerName'>) => void;
  
  // Consumer Actions
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (address: string) => void;
  
  // Delivery Actions
  updateDeliveryStatus: (orderId: string, status: OrderStatus, deliveryId?: string, distance?: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization (simulating DB) ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gf_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gf_products');
    return saved ? JSON.parse(saved) : [
      // Seed some initial data with ratings and reviews
      { 
        id: 'p1', 
        farmerId: 'f1', 
        farmerName: 'Green Valley Farm', 
        name: 'Organic Tomatoes', 
        price: 40, 
        quantity: 100, 
        imageUrl: 'https://picsum.photos/id/102/300/300', 
        description: 'Fresh red tomatoes from the vine.',
        category: 'Vegetables',
        rating: 4.5,
        reviews: [
            { id: 'r1', userName: 'Alice', rating: 5, comment: 'Super fresh and juicy!', date: '2024-10-10' },
            { id: 'r2', userName: 'Bob', rating: 4, comment: 'Good quality.', date: '2024-10-12' }
        ]
      },
      { 
        id: 'p2', 
        farmerId: 'f1', 
        farmerName: 'Green Valley Farm', 
        name: 'Fresh Potatoes', 
        price: 30, 
        quantity: 500, 
        imageUrl: 'https://picsum.photos/id/113/300/300', 
        description: 'Farm fresh potatoes, perfect for fries.',
        category: 'Vegetables',
        rating: 4.2,
        reviews: [
            { id: 'r3', userName: 'Charlie', rating: 4, comment: 'Great for baking.', date: '2024-10-15' }
        ]
      },
      { 
        id: 'p3', 
        farmerId: 'f2', 
        farmerName: 'Sunny Orchard', 
        name: 'Sweet Strawberries', 
        price: 120, 
        quantity: 50, 
        imageUrl: 'https://picsum.photos/id/1080/300/300', 
        description: 'Juicy organic strawberries. Pre-order for next week!',
        category: 'Fruits',
        isPreOrder: true,
        availableDate: '2024-12-01',
        rating: 4.8,
        reviews: [
             { id: 'r4', userName: 'Diana', rating: 5, comment: 'Sweetest strawberries ever!', date: '2024-09-20' },
             { id: 'r5', userName: 'Evan', rating: 5, comment: 'Worth the wait.', date: '2024-09-22' }
        ]
      },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gf_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('gf_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('gf_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('gf_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('gf_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('gf_cart', JSON.stringify(cart)), [cart]);

  // --- Actions ---

  const login = (email: string, role: UserRole) => {
    // Simplified login matching email and role
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, role: UserRole) => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: Date.now().toString(), name, email, role };
    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'farmerId' | 'farmerName'>) => {
    if (!user || user.role !== UserRole.FARMER) return;
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      farmerId: user.id,
      farmerName: user.name,
      rating: 0,
      reviews: []
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, cartQuantity: p.cartQuantity + quantity } : p);
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(p => {
        if (p.id === productId) {
            return { ...p, cartQuantity: Math.max(1, quantity) }; // Minimum 1
        }
        return p;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (address: string) => {
    if (!user || cart.length === 0) return;
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      consumerId: user.id,
      consumerName: user.name,
      items: [...cart],
      totalAmount,
      status: OrderStatus.PENDING,
      deliveryAddress: address,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Decrease product quantity (simple simulation)
    // For pre-orders, we assume stock is allocated from future harvest
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, quantity: Math.max(0, p.quantity - cartItem.cartQuantity) };
      }
      return p;
    }));
  };

  const updateDeliveryStatus = (orderId: string, status: OrderStatus, deliveryId?: string, distance?: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      const updates: Partial<Order> = { status };
      if (deliveryId) updates.deliveryId = deliveryId;
      if (distance !== undefined) {
        updates.distanceKm = distance;
        updates.deliveryCost = distance * 5; // ₹5 per KM rule
      }
      return { ...o, ...updates };
    }));
  };

  return (
    <StoreContext.Provider value={{
      user, users, products, orders, cart,
      login, register, logout,
      addProduct, addToCart, updateCartQuantity, removeFromCart, clearCart, placeOrder,
      updateDeliveryStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};