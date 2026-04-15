import api from './api';
import { AuthResponse, User } from '@/types/user.types';

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    return api.post('/auth/register', { email, password });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post('/auth/login', { email, password });
  },

  async getProfile(): Promise<User> {
    return api.get('/auth/profile');
  },
};