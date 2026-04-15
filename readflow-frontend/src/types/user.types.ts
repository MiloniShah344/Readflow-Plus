export interface User {
  id: string;
  email: string;
  theme: string;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}