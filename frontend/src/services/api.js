import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getFullImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

// Intercept 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

export const forgotPasswordApi = async (usernameOrEmail, role) => {
  const response = await apiClient.post('/auth/forgot-password', { usernameOrEmail, role });
  return response.data;
};

export const resetPasswordApi = async (usernameOrEmail, resetCode, newPassword) => {
  const response = await apiClient.post('/auth/reset-password', { usernameOrEmail, resetCode, newPassword });
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

// Complaints Services (Phase 2)
export const getAllComplaints = async (status, category) => {
  const params = {};
  if (status) params.status = status;
  if (category) params.category = category;
  const response = await apiClient.get('/complaints', { params });
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await apiClient.get('/complaints/my');
  return response.data;
};

export const trackComplaint = async (trackingNumber) => {
  const response = await apiClient.get(`/complaints/track/${encodeURIComponent(trackingNumber)}`);
  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await apiClient.post('/complaints', complaintData);
  return response.data;
};

export const updateComplaintStatus = async (complaintId, updateData) => {
  const response = await apiClient.patch(`/complaints/${complaintId}/status`, updateData);
  return response.data;
};

export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Department & SLA Services (Phase 3)
export const getAllDepartments = async () => {
  const response = await apiClient.get('/departments');
  return response.data;
};

export const getDepartmentByCode = async (code) => {
  const response = await apiClient.get(`/departments/${encodeURIComponent(code)}`);
  return response.data;
};

export const getSlaAnalytics = async () => {
  const response = await apiClient.get('/analytics/sla-summary');
  return response.data;
};

export const getOfficerTickets = async () => {
  const response = await apiClient.get('/complaints/officer/tickets');
  return response.data;
};

export const assignComplaint = async (complaintId, officerId, departmentId) => {
  const params = {};
  if (officerId) params.officerId = officerId;
  if (departmentId) params.departmentId = departmentId;
  const response = await apiClient.post(`/complaints/${complaintId}/assign`, null, { params });
  return response.data;
};

// AI Vision Services (Phase 4)
export const analyzeIssueWithAi = async ({ imageUrl, title, description, categoryHint }) => {
  const response = await apiClient.post('/ai/analyze', {
    image_url: imageUrl,
    title,
    description,
    category_hint: categoryHint,
  });
  return response.data;
};

export const checkAiServiceHealth = async () => {
  try {
    const response = await apiClient.get('/ai/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Notification & Feedback Services (Phase 5)
export const getMyNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

export const rateComplaintResolution = async (complaintId, { rating, feedback }) => {
  const response = await apiClient.post(`/complaints/${complaintId}/rate`, { rating, feedback });
  return response.data;
};

export const reopenComplaint = async (complaintId, { reason }) => {
  const response = await apiClient.post(`/complaints/${complaintId}/reopen`, { reason });
  return response.data;
};
