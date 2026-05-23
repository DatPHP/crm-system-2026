import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "../services/order.service";
import { FileText } from "lucide-react";
import { downloadFile } from "../utils/download";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusFlow = ["PENDING", "PAID", "COMPLETED"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOne(parseInt(id!)),
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) =>
      orderService.update(parseInt(id!), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Status updated!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancel(parseInt(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleInvoice = async () => {
    try {
      const blob = await orderService.getInvoice(parseInt(id!));
      downloadFile(blob, `invoice-${order.orderCode}.pdf`);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  if (isLoading)
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!order)
    return (
      <div className="text-center py-20 text-red-400">Order not found</div>
    );

  const currentStatusIndex = statusFlow.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold font-mono">{order.orderCode}</h1>
            <p className="text-sm text-gray-500">
              Created {new Date(order.createdAt).toLocaleString()} by{" "}
              {order.createdBy?.name}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Customer</h2>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                <strong>{order.customer?.fullName}</strong>
              </p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                {order.customer?.email || "—"}
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                {order.customer?.phone || "—"}
              </p>
              <p>
                <span className="text-gray-500">Address:</span>{" "}
                {order.customer?.address || "—"}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Order Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Unit Price</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item: any) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{item.product?.title}</td>
                    <td className="py-2 text-gray-500 font-mono text-xs">
                      {item.product?.sku}
                    </td>
                    <td className="py-2">
                      ${Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2 text-right font-semibold">
                      ${Number(item.subtotal).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="pt-3 text-right font-bold">
                    Total:
                  </td>
                  <td className="pt-3 text-right font-bold text-lg">
                    ${Number(order.totalPrice).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">History</h2>
            <div className="space-y-3">
              {order.orderHistories.length === 0 ? (
                <p className="text-gray-400 text-sm">No history yet</p>
              ) : (
                order.orderHistories.map((h: any) => (
                  <div
                    key={h.id}
                    className="flex gap-3 text-sm border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">{h.action}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(h.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {h.description && (
                        <p className="text-gray-500 mt-0.5">{h.description}</p>
                      )}
                      <p className="text-xs text-blue-500 mt-0.5">
                        by {h.createdBy?.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Update Status</h2>
            <div className="space-y-2">
              {statusFlow.map((status, index) => (
                <button
                  key={status}
                  disabled={
                    order.status === "CANCELLED" ||
                    order.status === status ||
                    index <= currentStatusIndex
                  }
                  onClick={() => updateMutation.mutate(status)}
                  className={`w-full py-2 rounded-lg text-sm font-medium border transition-colors
                    ${
                      order.status === status
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={handleInvoice}
              className="w-full mt-2 py-2 rounded-lg text-sm font-medium border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <FileText size={16} /> Print Invoice
            </button>

            {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
              <button
                onClick={() => {
                  if (confirm("Cancel this order?")) cancelMutation.mutate();
                }}
                className="w-full mt-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
