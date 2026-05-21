import api from "../lib/axios";

export const orderService = {
  getAll: (search?: string) =>
    api
      .get("/orders", { params: search ? { search } : {} })
      .then((r) => r.data),
  getOne: (id: number) => api.get(`/orders/${id}`).then((r) => r.data),
  create: (data: any) => api.post("/orders", data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.patch(`/orders/${id}`, data).then((r) => r.data),
  cancel: (id: number) => api.patch(`/orders/${id}/cancel`).then((r) => r.data),
  exportExcel: () =>
    api
      .get("/export/orders/excel", { responseType: "blob" })
      .then((r) => r.data),
  exportPdf: () =>
    api.get("/export/orders/pdf", { responseType: "blob" }).then((r) => r.data),
  getInvoice: (id: number) =>
    api
      .get(`/export/orders/${id}/invoice`, { responseType: "blob" })
      .then((r) => r.data),
};