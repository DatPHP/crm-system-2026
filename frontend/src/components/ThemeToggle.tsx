import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/theme.store";

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="
        relative w-10 h-10 rounded-lg
        flex items-center justify-center
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
      "
    >
      {isDark ? (
        <Sun
          size={18}
          className="text-yellow-400 transition-transform duration-300 rotate-0"
        />
      ) : (
        <Moon
          size={18}
          className="text-gray-600 transition-transform duration-300"
        />
      )}
    </button>
  );
}
