import api from '../lib/axios';

export const productService = {
  getAll: () => api.get('/products').then(r => r.data),
  getOne: (id: number) => api.get(`/products/${id}`).then(r => r.data),
  create: (data: any) => api.post('/products', data).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/products/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/products/${id}`).then(r => r.data),
};