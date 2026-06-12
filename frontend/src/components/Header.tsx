import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import ConnectionStatus from "./ConnectionStatus";
import ThemeToggle from "./ThemeToggle";
import { userService } from "../services/user.service";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch profile để lấy avatar realtime
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });

  const handleLogout = async () => {
    await logout();
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  const displayName = profile?.name || user?.name || "Admin";
  const displayAvatar = profile?.avatar || null;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header
      className="
      h-16 bg-white dark:bg-gray-800
      border-b border-gray-200 dark:border-gray-700
      flex items-center justify-between px-4
      shadow-sm transition-colors duration-200
    "
    >
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <ConnectionStatus />
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {displayName}
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
                {/* Avatar preview in dropdown */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-50 dark:hover:bg-gray-700"
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
