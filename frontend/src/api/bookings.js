import api from './axiosInstance';

// Response interceptor to extract error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const err = new Error(message);
    err.status = error.response?.status;
    return Promise.reject(err);
  }
);

export const createBooking = (data) => api.post('/bookings', data);
export const fetchBookingsByEmail = (email) => api.get('/bookings', { params: { email } });
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });

export default api;
