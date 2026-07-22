import axios from 'axios';
import {
  ApiResponseEnvelope,
  IUser,
  IVehicle,
  IPurchase,
  PaginatedVehiclesResponse,
  AnalyticsSummary,
} from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (payload: Record<string, unknown>) => {
    const response = await apiClient.post<ApiResponseEnvelope<{ user: IUser; accessToken: string }>>(
      '/auth/register',
      payload,
    );
    return response.data;
  },

  login: async (payload: Record<string, unknown>) => {
    const response = await apiClient.post<ApiResponseEnvelope<{ user: IUser; accessToken: string }>>(
      '/auth/login',
      payload,
    );
    return response.data;
  },
};

export const vehicleService = {
  getVehicles: async (params: Record<string, unknown> = {}) => {
    const response = await apiClient.get<ApiResponseEnvelope<PaginatedVehiclesResponse>>('/vehicles', {
      params,
    });
    return response.data;
  },

  getVehicleById: async (id: string) => {
    const response = await apiClient.get<ApiResponseEnvelope<IVehicle>>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (payload: Partial<IVehicle>) => {
    const response = await apiClient.post<ApiResponseEnvelope<IVehicle>>('/vehicles', payload);
    return response.data;
  },

  updateVehicle: async (id: string, payload: Partial<IVehicle>) => {
    const response = await apiClient.put<ApiResponseEnvelope<IVehicle>>(`/vehicles/${id}`, payload);
    return response.data;
  },

  deleteVehicle: async (id: string) => {
    const response = await apiClient.delete<ApiResponseEnvelope<{ id: string }>>(`/vehicles/${id}`);
    return response.data;
  },

  restockVehicle: async (id: string, quantity: number) => {
    const response = await apiClient.post<ApiResponseEnvelope<IVehicle>>(`/vehicles/${id}/restock`, {
      quantity,
    });
    return response.data;
  },

  purchaseVehicle: async (id: string, quantity: number = 1) => {
    const response = await apiClient.post<ApiResponseEnvelope<IPurchase>>(`/vehicles/${id}/purchase`, {
      quantity,
    });
    return response.data;
  },
};

export const purchaseService = {
  getUserPurchases: async () => {
    const response = await apiClient.get<ApiResponseEnvelope<IPurchase[]>>('/purchases/my');
    return response.data;
  },

  getAllPurchases: async () => {
    const response = await apiClient.get<ApiResponseEnvelope<IPurchase[]>>('/purchases');
    return response.data;
  },

  getAnalyticsSummary: async () => {
    const response = await apiClient.get<ApiResponseEnvelope<AnalyticsSummary>>('/purchases/analytics/summary');
    return response.data;
  },
};
