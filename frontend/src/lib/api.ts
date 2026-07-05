import axios from 'axios';

console.log("API URL =", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cb_token');
      localStorage.removeItem('cb_user');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/signup'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ============== AUTH ==============
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),

  // ✅ FIXED: must be GET with query param
  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`).then((r) => r.data),

  resendVerification: () =>
    api.post('/auth/resend-verification').then((r) => r.data),

  me: () => api.get('/auth/me').then((r) => r.data),
};

// ============== PRODUCTS ==============
export const productAPI = {
  list: (params: Record<string, any>) =>
    api.get('/products', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get(`/products/${id}`).then((r) => r.data),

  create: (data: any) =>
  api.post('/products', data).then((r) => r.data),

  my: () =>
    api.get('/products/me').then((r) => r.data),

  reserve: (id: string) =>
    api.post(`/products/${id}/reserve`).then((r) => r.data),

  markSold: (id: string) =>
    api.post(`/products/${id}/sold`).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),
};

// ============== CHAT ==============
export const chatAPI = {
  getOrCreate: (productId: string) =>
    api.post('/chat/conversations', { productId }).then((r) => r.data),

  list: () =>
    api.get('/chat/conversations').then((r) => r.data),

  getMessages: (id: string) =>
    api.get(`/chat/conversations/${id}/messages`).then((r) => r.data),

  sendMessage: (id: string, content: string) =>
    api.post(`/chat/conversations/${id}/messages`, { content }).then((r) => r.data),

  sendOffer: (id: string, amount: number) =>
    api.post(`/chat/conversations/${id}/offers`, { amount }).then((r) => r.data),

  respondOffer: (offerId: string, action: string, counterAmount?: number) =>
    api.post(`/chat/offers/${offerId}/respond`, { action, counterAmount }).then((r) => r.data),
};

// ============== USERS ==============
export const userAPI = {
  get: (id: string) =>
    api.get(`/users/${id}`).then((r) => r.data),

  getProducts: (id: string) =>
    api.get(`/users/${id}/products`).then((r) => r.data),

  getReviews: (id: string) =>
    api.get(`/users/${id}/reviews`).then((r) => r.data),

  updateMe: (data: any) =>
    api.put('/users/me', data).then((r) => r.data),

  rate: (data: { productId: string; rating: number; review: string }) =>
    api.post('/users/rate', data).then((r) => r.data),
};

// ============== NOTIFICATIONS ==============
export const notifAPI = {
  list: () =>
    api.get('/notifications').then((r) => r.data),

  markAllRead: () =>
    api.post('/notifications/read-all').then((r) => r.data),
};

// ============== UPLOAD ==============
export const uploadAPI = {
  images: (formData: FormData) =>
    api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
};