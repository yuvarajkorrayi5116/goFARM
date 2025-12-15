import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="text-center space-y-16">
      {/* Hero */}
      <div className="relative bg-farm-900 rounded-3xl overflow-hidden shadow-2xl text-white py-24 px-6">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef38ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Freshness Delivered <br/> <span className="text-farm-400">Straight from the Soil</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10">
            Connect directly with local farmers. Quality organic produce, fair prices, and swift delivery to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-farm-500 text-white font-bold rounded-full hover:bg-farm-400 transition transform hover:-translate-y-1 shadow-lg">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-farm-900 font-bold rounded-full hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-lg">
              Login Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-10 px-4">
        <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sprout size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">For Farmers</h3>
          <p className="text-gray-500">List your harvest directly to consumers. Get the best price for your hard work without middlemen.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">For Consumers</h3>
          <p className="text-gray-500">Access 100% organic, farm-fresh products. Transparent pricing and quality assurance.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Delivery Network</h3>
          <p className="text-gray-500">Flexible earning opportunities. Deliver fresh produce based on distance and availability.</p>
        </div>
      </div>
    </div>
  );
};