import api from './api';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  upload: (formData) =>
    api.post('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/content/${id}`),
};

export const magazineAPI = {
  getAll: (params) => api.get('/magazine', { params }),
  create: (formData) =>
    api.post('/magazine', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/magazine/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivityLogs: () => api.get('/dashboard/activity-logs'),
};
