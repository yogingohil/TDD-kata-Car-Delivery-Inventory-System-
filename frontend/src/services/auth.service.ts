import { apiClient } from './api.service';
import { ApiResponse } from '../types/api';
import { User } from '../types/user';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApiService = {
  async register(data: Record<string, unknown>): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  async login(data: Record<string, unknown>): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },
};
