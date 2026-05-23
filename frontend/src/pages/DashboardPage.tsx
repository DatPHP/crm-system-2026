import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { dashboardService } from "../services/dashboard.service";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getSummary,
  });

  if (isLoading)
    return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const cards = [
    {
      label: "Total Products",
      value: data.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      label: "Total Customers",
      value: data.totalCustomers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Revenue",
      value: `$${Number(data.revenue).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 border shadow-sm flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p
                className="text-2xl font-bold truncate"
                title={String(card.value)}
              >
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Order Code</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{order.orderCode}</td>
                  <td className="py-2">{order.customer.fullName}</td>
                  <td className="py-2">
                    ${Number(order.totalPrice).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {data.ordersByStatus.map((item: any) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
                <span className="font-bold text-gray-700">
                  {item._count.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
