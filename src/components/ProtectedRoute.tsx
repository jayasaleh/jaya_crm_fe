/**
 * Protected Route Component
 * Wrapper component to protect routes that require authentication
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'SALES' | 'MANAGER';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const user = storage.getUser();
  const token = storage.getAccessToken();

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

