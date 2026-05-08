import apiClient from '../utils/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Registration failed',
      } as AuthError;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Login failed',
      } as AuthError;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to get current user',
      } as AuthError;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Token refresh failed',
      } as AuthError;
    }
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Set token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
