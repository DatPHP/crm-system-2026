import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import { useState } from "react";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm">
      {/* Toggle sidebar button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      {/* Right side */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="text-sm font-medium">{user?.name || "Admin"}</span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border z-50">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={16} /> Profile
            </button>
            <hr />
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
