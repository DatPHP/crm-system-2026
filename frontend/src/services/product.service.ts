import api from "../lib/axios";

export const productService = {
  getAll: (search?: string) =>
    api
      .get("/products", { params: search ? { search } : {} })
      .then((r) => r.data),
  getOne: (id: number) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data: any) => api.post("/products", data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.patch(`/products/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
  exportExcel: () =>
    api
      .get("/export/products/excel", { responseType: "blob" })
      .then((r) => r.data),
};