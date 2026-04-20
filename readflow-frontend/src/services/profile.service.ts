import api from './api';
import { User } from '@/types/user.types';

export const profileService = {
  async updateMe(data: { name?: string; theme?: string }): Promise<User> {
    return api.patch('/users/me', data);
  },
  async changePassword(oldPassword: string, newPassword: string) {
    return api.patch('/auth/change-password', { oldPassword, newPassword });
  },
};