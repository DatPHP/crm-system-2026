import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Eye } from "lucide-react";
import { orderService } from "../services/order.service";
import SearchInput from "../components/SearchInput";
import ExportButton from "../components/ExportButton";
import { useDebounce } from "../hooks/useDebounce";
import { downloadFile } from "../utils/download";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", debouncedSearch],
    queryFn: () => orderService.getAll(debouncedSearch || undefined),
  });

  const cancelMutation = useMutation({
    mutationFn: orderService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order cancelled!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleInvoice = async (orderId: number, orderCode: string) => {
    try {
      const blob = await orderService.getInvoice(orderId);
      downloadFile(blob, `invoice-${orderCode}.pdf`);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  if (isLoading)
    return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search code, customer..."
          />
          <ExportButton
            options={[
              {
                label: "Excel",
                icon: "excel",
                filename: "orders.xlsx",
                onExport: orderService.exportExcel,
              },
              {
                label: "PDF",
                icon: "pdf",
                filename: "orders.pdf",
                onExport: orderService.exportPdf,
              },
            ]}
          />
          <button
            onClick={() => navigate("/orders/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
          >
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order Code",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    {debouncedSearch
                      ? `No orders found for "${debouncedSearch}"`
                      : "No orders yet"}
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">
                      {order.orderCode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.customer?.fullName}
                    </td>
                    <td className="px-4 py-3">
                      {order.orderItems?.length} items
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      $
                      {Number(order.totalPrice).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="View detail"
                        >
                          <Eye size={16} />
                        </button>
                        {order.status !== "CANCELLED" &&
                          order.status !== "COMPLETED" && (
                            <button
                              onClick={() => {
                                if (confirm("Cancel this order?"))
                                  cancelMutation.mutate(order.id);
                              }}
                              className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}