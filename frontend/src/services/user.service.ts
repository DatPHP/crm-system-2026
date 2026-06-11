import api from "../lib/axios";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
}

export const userService = {
  getProfile: (): Promise<UserProfile> =>
    api.get("/users/profile").then((r) => r.data),

  updateProfile: (data: { name: string }): Promise<UserProfile> =>
    api.patch("/users/profile", data).then((r) => r.data),

  updateAvatar: (
    file: File,
  ): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
  }> => {
    const form = new FormData();
    form.append("file", file);
    return api
      .patch("/users/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> =>
    api.patch("/users/password", data).then((r) => r.data),
};
