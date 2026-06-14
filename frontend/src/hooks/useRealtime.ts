import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSocket } from "./useSocket";

export function useRealtime() {
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Khi có order mới → invalidate queries
    socket.on("order:created", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // ← thêm
      toast.success(`🛒 New order: ${data.orderCode}`, {
        description: `$${Number(data.totalPrice).toLocaleString()} — ${data.customerName}`,
        duration: 5000,
      });
    });

    // Khi order status thay đổi
    socket.on("order:updated", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["order", String(data.id)] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // ← thêm
      toast.info(`📦 Order ${data.orderCode}: ${data.status}`, {
        duration: 4000,
      });
    });

    // Dashboard stats update
    socket.on("dashboard:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    });

    // General notifications
    socket.on("notification", (data: any) => {
      if (data.type === "success") toast.success(data.message);
      if (data.type === "warning") toast.warning(data.message);
      if (data.type === "info") toast.info(data.message);
    });

    return () => {
      socket.off("order:created");
      socket.off("order:updated");
      socket.off("dashboard:updated");
      socket.off("notification");
    };
  }, [socket, queryClient]);

  return { connected };
}
