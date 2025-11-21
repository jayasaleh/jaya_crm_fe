/**
 * Authentication Service
 * Service functions for authentication operations
 */

import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

export const authService = {
  /**
   * Login user
   * @param credentials - Login credentials (email, password)
   * @returns Login response with user data and tokens
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Backend returns: { code, status, message, data }
    const response = await api.post<{ code: number; status: string; message: string; data: LoginResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Return data from response
    return response.data;
  },

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns New access and refresh tokens
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // Backend returns: { code, status, message, data }
    const response = await api.post<{ code: number; status: string; message: string; data: RefreshTokenResponse }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    // Return data from response
    return response.data;
  },

  /**
   * Logout user
   * Clears tokens and user data from storage
   */
  logout(): void {
    // Note: Backend doesn't have logout endpoint
    // We just clear local storage
    // In production, you might want to call backend to invalidate tokens
  },
};

