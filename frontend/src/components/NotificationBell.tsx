import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  Package,
  CreditCard,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { notificationService } from "../services/notification.service";
import { useSocket } from "../hooks/useSocket";

// Icon theo type
const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  order_created: {
    icon: <ShoppingCart size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  order_paid: {
    icon: <CreditCard size={14} />,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  order_completed: {
    icon: <Check size={14} />,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  order_cancelled: {
    icon: <XCircle size={14} />,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  default: {
    icon: <Package size={14} />,
    color: "text-gray-600",
    bg: "bg-gray-100 dark:bg-gray-700",
  },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
    refetchInterval: 30000, // refetch mỗi 30s
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Real-time: khi có order mới → refetch notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("order:created", handleNewOrder);
    socket.on("order:updated", handleNewOrder);

    return () => {
      socket.off("order:created", handleNewOrder);
      socket.off("order:updated", handleNewOrder);
    };
  }, [socket, queryClient]);

  // Click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All marked as read");
    },
  });

  const removeMutation = useMutation({
    mutationFn: notificationService.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const clearReadMutation = useMutation({
    mutationFn: notificationService.clearRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Cleared read notifications");
    },
  });

  const handleClick = async (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to order nếu có metadata
    if (notification.metadata?.orderId) {
      navigate(`/orders/${notification.metadata.orderId}`);
      setOpen(false);
    }
  };

  const config = (type: string) => typeConfig[type] || typeConfig.default;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Notifications"
      >
        <Bell size={18} className="text-gray-600 dark:text-gray-300" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="
            absolute -top-0.5 -right-0.5
            min-w-[18px] h-[18px] px-1
            bg-red-500 text-white
            text-[10px] font-bold
            rounded-full flex items-center justify-center
            animate-pulse
          "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
          absolute right-0 mt-2 w-80 sm:w-96 z-50
          bg-white dark:bg-gray-800
          rounded-xl shadow-xl
          border border-gray-200 dark:border-gray-700
          overflow-hidden
        "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllMutation.mutate()}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600"
                  title="Mark all as read"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              {notifications.some((n: any) => n.isRead) && (
                <button
                  onClick={() => clearReadMutation.mutate()}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500"
                  title="Clear read"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Bell size={32} className="mb-2 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification: any) => {
                const cfg = config(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`
                      flex gap-3 px-4 py-3 cursor-pointer
                      hover:bg-gray-50 dark:hover:bg-gray-700/50
                      border-b border-gray-100 dark:border-gray-700/50
                      last:border-0 transition-colors
                      ${!notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}
                    `}
                    onClick={() => handleClick(notification)}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium leading-tight ${
                            notification.isRead
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {notification.title}
                        </p>

                        {/* Unread dot */}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {timeAgo(notification.createdAt)}
                        </span>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMutation.mutate(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-center text-gray-400">
                Showing last {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
