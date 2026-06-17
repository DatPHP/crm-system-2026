import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        // Vẫn giữ localStorage riêng cho axios interceptor đọc trực tiếp
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
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
        const storeToken = get().accessToken;
        const localToken =
          localStorage.getItem("accessToken") || localStorage.getItem("token");
        return !!(storeToken || localToken);
      },
    }),
    {
      name: "auth-storage", // key trong localStorage
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);