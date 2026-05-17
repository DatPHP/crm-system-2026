import api from '../lib/axios';

export const categoryService = {
  getAll: () => api.get('/categories').then(r => r.data),
  getOne: (id: number) => api.get(`/categories/${id}`).then(r => r.data),
  create: (data: any) => api.post('/categories', data).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/categories/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/categories/${id}`).then(r => r.data),
};