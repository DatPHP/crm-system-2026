import { create } from "zustand";
import api from "../lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken:
    localStorage.getItem("accessToken") || localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // Xóa key cũ nếu còn
    localStorage.removeItem("token");
    set({ user, accessToken, refreshToken });
  },

  logout: async () => {
    const refreshToken = get().refreshToken;
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch {}
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  isAuthenticated: () => {
    // Check cả store state lẫn localStorage (cho trường hợp page reload)
    const storeToken = get().accessToken;
    const localToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    return !!(storeToken || localToken);
  },
}));
