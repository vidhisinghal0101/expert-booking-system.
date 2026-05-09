import api from './axiosInstance';

// Response interceptor to extract error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const fetchExperts = (params) => api.get('/experts', { params });
export const fetchExpertById = (id) => api.get(`/experts/${id}`);

export default api;
