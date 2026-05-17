import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tag,
  Package,
  Users,
  ShoppingCart,
} from 'lucide-react';

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        {isOpen ? (
          <span className="text-xl font-bold text-blue-400">CRM System</span>
        ) : (
          <span className="text-xl font-bold text-blue-400">C</span>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`
            }
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}