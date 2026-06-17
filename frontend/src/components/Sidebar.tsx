import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tag,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { ShieldCheck } from "lucide-react";

const { user } = useAuthStore();
const menuItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/categories", icon: Tag, label: "Categories" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  ...(user?.role === "SUPER_ADMIN"
    ? [{ to: "/audit-logs", icon: ShieldCheck, label: "Audit Logs" }]
    : []),
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={`
      bg-gray-900 dark:bg-gray-950
      text-white transition-all duration-300
      flex flex-col
      ${isOpen ? "w-64" : "w-16"}
    `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700 dark:border-gray-800">
        {isOpen ? (
          <span className="text-xl font-bold text-blue-400">CRM System</span>
        ) : (
          <span className="text-xl font-bold text-blue-400">C</span>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3
              hover:bg-gray-700 dark:hover:bg-gray-800
              transition-colors duration-150
              ${isActive ? "bg-blue-600 hover:bg-blue-700" : ""}
            `}
          >
            <item.icon size={20} className="shrink-0" />
            {isOpen && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
