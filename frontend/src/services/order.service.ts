import api from '../lib/axios';

export const orderService = {
  getAll: () => api.get('/orders').then(r => r.data),
  getOne: (id: number) => api.get(`/orders/${id}`).then(r => r.data),
  create: (data: any) => api.post('/orders', data).then(r => r.data),
  update: (id: number, data: any) => api.patch(`/orders/${id}`, data).then(r => r.data),
  cancel: (id: number) => api.patch(`/orders/${id}/cancel`).then(r => r.data),
};