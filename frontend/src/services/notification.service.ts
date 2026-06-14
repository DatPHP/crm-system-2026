import api from "../lib/axios";

export const notificationService = {
  getAll: () => api.get("/notifications").then((r) => r.data),

  markAsRead: (id: number) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () => api.patch("/notifications/read-all").then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/notifications/${id}`).then((r) => r.data),

  clearRead: () => api.delete("/notifications/clear/read").then((r) => r.data),
};
