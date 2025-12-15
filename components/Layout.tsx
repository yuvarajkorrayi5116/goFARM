import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart, User as UserIcon, Sprout } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, cart } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-farm-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-farm-100" />
                <span className="font-bold text-xl tracking-tight">GO FARM</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 bg-farm-900 px-3 py-1 rounded-full text-sm">
                    <UserIcon size={16} />
                    <span>{user.name} ({user.role})</span>
                  </div>

                  {user.role === 'CONSUMER' && (
                    <Link to="/consumer/cart" className="relative p-2 hover:bg-farm-700 rounded-full transition">
                      <ShoppingCart size={24} />
                      {cart.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                          {cart.reduce((a, b) => a + b.cartQuantity, 0)}
                        </span>
                      )}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:bg-farm-700 px-3 py-2 rounded-md transition"
                  >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="hover:text-farm-100 transition">Login</Link>
                  <Link to="/register" className="bg-farm-600 hover:bg-farm-500 text-white px-4 py-2 rounded-md transition">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 GO FARM. Connecting nature to your doorstep.</p>
        </div>
      </footer>
    </div>
  );
};