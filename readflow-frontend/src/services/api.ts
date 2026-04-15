import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('rf_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Unwrap the { data, success, timestamp } wrapper from the backend
api.interceptors.response.use(
  (response) => {
    // Our backend wraps everything in { data: ..., success: true }
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong';

    // Auto-logout on 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rf_token');
        localStorage.removeItem('rf_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  },
);

export default api;