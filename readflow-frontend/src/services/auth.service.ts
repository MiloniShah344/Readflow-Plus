import api from './api';
import { AuthResponse, User } from '@/types/user.types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return api.post('/auth/register', { name, email, password });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post('/auth/login', { email, password });
  },

  async getProfile(): Promise<User> {
    return api.get('/auth/profile');
  },
};