import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('urbanfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 unauthorized to automatically clear session if expired
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't clear on login attempt failures
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('urbanfix_token');
        localStorage.removeItem('urbanfix_user');
      }
    }
    return Promise.reject(error);
  }
);

export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Connection failed',
    };
  }
};

// Auth Services
export const loginApi = async (usernameOrEmail, password) => {
  const response = await apiClient.post('/auth/login', { usernameOrEmail, password });
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Role-protected dashboard APIs
export const getCitizenDashboard = async () => {
  const response = await apiClient.get('/citizen/dashboard');
  return response.data;
};

export const getOfficerDashboard = async () => {
  const response = await apiClient.get('/officer/dashboard');
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};
