/**
 * Authentication Hook
 * React hook for managing authentication state and operations
 */

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import { LoginRequest, User } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

const AUTH_QUERY_KEY = ['auth'] as const;

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // Save tokens to storage
      storage.setAccessToken(data.accessToken);
      storage.setRefreshToken(data.refreshToken);
      
      // Update global state
      setUser(data.user);

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);

      // Show success message
      toast.success('Login successful!');

      // Redirect to dashboard
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    },
  });

  // Logout function
  const logout = () => {
    // Clear global state
    clearAuth();

    // Clear query cache
    queryClient.clear();

    // Show message
    toast.success('Logged out successfully');

    // Redirect to login
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending,
    login: loginMutation.mutate,
    logout,
  };
}

