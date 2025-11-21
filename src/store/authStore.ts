/**
 * Auth Store (Zustand)
 * Global state management for authentication
 */

import { create } from 'zustand';
import { User } from '../types/auth.types';
import { storage } from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      storage.setUser(user);
    } else {
      storage.removeUser();
    }
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false });
    storage.clear();
  },

  initializeAuth: () => {
    const user = storage.getUser() as User | null;
    set({ user, isAuthenticated: !!user });
  },
}));

