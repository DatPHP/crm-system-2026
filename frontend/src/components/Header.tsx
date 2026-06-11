import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import { useState } from "react";
import ConnectionStatus from "./ConnectionStatus";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <header
      className="
      h-16 bg-white dark:bg-gray-800
      border-b border-gray-200 dark:border-gray-700
      flex items-center justify-between px-4
      shadow-sm transition-colors duration-200
    "
    >
      {/* Toggle sidebar */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        <Menu size={20} />
      </button>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ConnectionStatus />
        <ThemeToggle />

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {user?.name || "Admin"}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div
                className="
                absolute right-0 mt-1 w-48 z-50
                bg-white dark:bg-gray-800
                rounded-lg shadow-lg
                border border-gray-200 dark:border-gray-700
              "
              >
                <button
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={16} /> Profile
                </button>
                <hr className="border-gray-200 dark:border-gray-700" />
                <button
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm
                    text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
