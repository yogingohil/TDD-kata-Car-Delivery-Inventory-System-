import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home.js';
import { Login } from '../pages/Login.js';
import { Register } from '../pages/Register.js';
import { Inventory } from '../pages/Inventory.js';
import { VehicleDetails } from '../pages/VehicleDetails.js';
import { Dashboard } from '../pages/Dashboard.js';
import { PurchaseHistory } from '../pages/PurchaseHistory.js';
import { AdminDashboard } from '../pages/AdminDashboard.js';
import { NotFound } from '../pages/NotFound.js';
import { useAuthStore } from '../store/authStore.js';
import { UserRole } from '../types/index.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== UserRole.ADMIN) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/vehicles/:id" element={<VehicleDetails />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchases"
        element={
          <ProtectedRoute>
            <PurchaseHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
