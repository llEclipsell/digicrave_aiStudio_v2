import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const session = localStorage.getItem('session-storage');
    if (session) {
      const { state } = JSON.parse(session);
      if (state?.guestToken) {
        config.headers.Authorization = `Bearer ${state.guestToken}`;
      }
    }
  } catch (error) {
    console.error('Error parsing session storage:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('session-storage');
      // Removed redirect to /menu to allow components to handle failures
    }
    return Promise.reject(error);
  }
);

/**
 * MENU API
 */
export const getRestaurantMenu = (slug: string) => api.get(`/menu/${slug}`);
export const getMenuItem = (itemId: string) => api.get(`/menu/item/${itemId}`);

/**
 * ORDER API
 */
export const placeOrder = (data: any) => api.post('/orders', data);

export const getOrder = (orderId: string) => api.get(`/orders/${orderId}`);

/**
 * PAYMENT API
 */
export const getTableBill = (tableId: string) => api.get(`/tables/${tableId}/bill`);

export const settleBill = (data: any) => api.post('/payments', data);

/**
 * FEEDBACK API
 */
export const submitFeedback = (data: any) => api.post('/feedback', data);

/**
 * STAFF API
 */
export const getActiveOrders = () => api.get('/staff/orders');

export const updateOrderStatus = (orderId: string, status: string) => 
  api.patch(`/orders/${orderId}/status`, { status });

export const getStaffTables = () => api.get('/staff/tables');

export const clearTable = (id: string) => api.post(`/tables/${id}/clear`);

/**
 * ADMIN API
 */
export const getAdminAnalytics = () => api.get('/admin/analytics');
