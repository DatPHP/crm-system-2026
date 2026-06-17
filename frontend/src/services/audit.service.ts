import api from "../lib/axios";

export const auditService = {
  getAll: (params?: {
    entity?: string;
    action?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get("/audit-logs", { params }).then((r) => r.data),

  getStats: () => api.get("/audit-logs/stats").then((r) => r.data),
};
