import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Filter,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { auditService } from "../services/audit.service";
import Pagination from "../components/Pagination";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

const actionConfig = {
  CREATE: {
    label: "Create",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: <Plus size={12} />,
  },
  UPDATE: {
    label: "Update",
    color:
      "bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400",
    icon: <Pencil size={12} />,
  },
  DELETE: {
    label: "Delete",
    color: "bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400",
    icon: <Trash2 size={12} />,
  },
};

const entityColors: Record<string, string> = {
  Order: "text-purple-600 dark:text-purple-400",
  Product: "text-blue-600   dark:text-blue-400",
  Customer: "text-green-600  dark:text-green-400",
  Category: "text-orange-600 dark:text-orange-400",
  User: "text-pink-600   dark:text-pink-400",
};

export default function AuditLogsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    entity: "",
    action: "",
    startDate: "",
    endDate: "",
  });
  const [showDetail, setShowDetail] = useState<any>(null);

  // Redirect nếu không phải SUPER_ADMIN
  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-500">Only SUPER_ADMIN can view audit logs.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["audit-logs", filters, page],
    queryFn: () =>
      auditService.getAll({
        ...filters,
        page,
        limit: 20,
        entity: filters.entity || undefined,
        action: filters.action || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ["audit-stats"],
    queryFn: auditService.getStats,
  });

  const logs = data?.data || [];
  const pagination = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Logs
          </h1>
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
            SUPER_ADMIN
          </span>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Logs
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>
          {stats.byAction?.map((a: any) => {
            const cfg = actionConfig[a.action as keyof typeof actionConfig];
            return (
              <div
                key={a.action}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {a.action}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {a._count.action}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${cfg?.color}`}
                >
                  {cfg?.icon} {cfg?.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filters.entity}
            onChange={(e) => {
              setFilters((f) => ({ ...f, entity: e.target.value }));
              setPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Entities</option>
            {["Order", "Product", "Customer", "Category", "User"].map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select
            value={filters.action}
            onChange={(e) => {
              setFilters((f) => ({ ...f, action: e.target.value }));
              setPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => {
              setFilters((f) => ({ ...f, startDate: e.target.value }));
              setPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => {
              setFilters((f) => ({ ...f, endDate: e.target.value }));
              setPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {[
                  "Time",
                  "User",
                  "Action",
                  "Entity",
                  "Entity ID",
                  "IP",
                  "Detail",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  const cfg =
                    actionConfig[log.action as keyof typeof actionConfig];
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            {log.userName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {log.userRole}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${cfg?.color}`}
                        >
                          {cfg?.icon} {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold text-xs ${entityColors[log.entity] || "text-gray-600"}`}
                        >
                          {log.entity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {log.entityId || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {log.ipAddress || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {(log.before || log.after) && (
                          <button
                            onClick={() => setShowDetail(log)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetail(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Audit Detail — {showDetail.entity} #{showDetail.entityId}
              </h3>
              <button
                onClick={() => setShowDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">User:</span>{" "}
                <strong className="text-gray-900 dark:text-white">
                  {showDetail.userName}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>{" "}
                <strong className="text-gray-900 dark:text-white">
                  {showDetail.userRole}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Action:</span>{" "}
                <strong className="text-gray-900 dark:text-white">
                  {showDetail.action}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>{" "}
                <strong className="text-gray-900 dark:text-white">
                  {new Date(showDetail.createdAt).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showDetail.before && (
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2">
                    BEFORE
                  </p>
                  <pre className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs overflow-auto max-h-60">
                    {JSON.stringify(showDetail.before, null, 2)}
                  </pre>
                </div>
              )}
              {showDetail.after && (
                <div>
                  <p className="text-xs font-semibold text-green-500 mb-2">
                    AFTER
                  </p>
                  <pre className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-lg text-xs overflow-auto max-h-60">
                    {JSON.stringify(showDetail.after, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
