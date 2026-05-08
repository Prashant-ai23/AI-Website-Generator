import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.client.post('/auth/register', { email, password, name });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  // Website endpoints
  async getWebsites() {
    return this.client.get('/websites');
  }

  async getWebsite(id: string) {
    return this.client.get(`/websites/${id}`);
  }

  async createWebsite(data: { title: string; description: string; theme: string }) {
    return this.client.post('/websites', data);
  }

  async updateWebsite(id: string, data: Record<string, unknown>) {
    return this.client.put(`/websites/${id}`, data);
  }

  async deleteWebsite(id: string) {
    return this.client.delete(`/websites/${id}`);
  }

  // Generic HTTP methods
  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async patch(url: string, data?: any, config?: any) {
    return this.client.patch(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }
}

export const apiClient = new ApiClient();
