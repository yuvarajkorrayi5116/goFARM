import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Truck, ShoppingBag } from 'lucide-react';

interface AuthProps {
  type: 'login' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ type }) => {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    if (type === 'login') {
      success = login(email, role);
    } else {
      success = register(name, email, role);
    }

    if (success) {
      if (role === UserRole.FARMER) navigate('/farmer');
      else if (role === UserRole.CONSUMER) navigate('/consumer');
      else if (role === UserRole.DELIVERY) navigate('/delivery');
    } else {
      setError(type === 'login' ? 'Invalid credentials or user not found.' : 'Email already in use.');
    }
  };

  const RoleCard = ({ r, icon: Icon, label }: { r: UserRole, icon: any, label: string }) => (
    <div 
      onClick={() => setRole(r)}
      className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
        role === r 
          ? 'border-farm-500 bg-farm-50 text-farm-800 shadow-md' 
          : 'border-gray-200 hover:border-farm-300 text-gray-500'
      }`}
    >
      <Icon size={32} />
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
      <div className="bg-farm-800 p-6 text-center">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          {type === 'login' ? 'Welcome Back' : 'Join Go Farm'}
        </h2>
        <p className="text-farm-200 mt-2 text-sm">Select your role to continue</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <RoleCard r={UserRole.CONSUMER} icon={ShoppingBag} label="Consumer" />
          <RoleCard r={UserRole.FARMER} icon={Sprout} label="Farmer" />
          <RoleCard r={UserRole.DELIVERY} icon={Truck} label="Delivery" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-500 focus:border-transparent outline-none transition"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-500 focus:border-transparent outline-none transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-farm-600 text-white font-bold py-3 rounded-lg hover:bg-farm-700 transition shadow-lg transform active:scale-95"
          >
            {type === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => navigate(type === 'login' ? '/register' : '/login')}
              className="text-farm-600 font-bold cursor-pointer hover:underline"
            >
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};