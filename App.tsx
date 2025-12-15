import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { ConsumerDashboard } from './pages/consumer/ConsumerDashboard';
import { Cart } from './pages/consumer/Cart';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { UserRole } from './types';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement, allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they access wrong route
    if (user.role === UserRole.FARMER) return <Navigate to="/farmer" replace />;
    if (user.role === UserRole.CONSUMER) return <Navigate to="/consumer" replace />;
    if (user.role === UserRole.DELIVERY) return <Navigate to="/delivery" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth type="login" />} />
      <Route path="/register" element={<Auth type="register" />} />
      
      {/* Farmer Routes */}
      <Route 
        path="/farmer" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.FARMER]}>
            <FarmerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Consumer Routes */}
      <Route 
        path="/consumer" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.CONSUMER]}>
            <ConsumerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/consumer/cart" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.CONSUMER]}>
            <Cart />
          </ProtectedRoute>
        } 
      />

      {/* Delivery Routes */}
      <Route 
        path="/delivery" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.DELIVERY]}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
}

export default App;