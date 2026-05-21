import api from "../lib/axios";

export const customerService = {
  getAll: (search?: string) =>
    api
      .get("/customers", { params: search ? { search } : {} })
      .then((r) => r.data),
  getOne: (id: number) => api.get(`/customers/${id}`).then((r) => r.data),
  create: (data: any) => api.post("/customers", data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.patch(`/customers/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/customers/${id}`).then((r) => r.data),
  exportExcel: () =>
    api
      .get("/export/customers/excel", { responseType: "blob" })
      .then((r) => r.data),
};