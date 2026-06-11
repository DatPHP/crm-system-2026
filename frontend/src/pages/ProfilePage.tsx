import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Save, Lock, User, Mail, Shield, Calendar } from "lucide-react";
import { userService } from "../services/user.service";
import { useAuthStore } from "../store/auth.store";

export default function ProfilePage() {
  const { user, setAuth, refreshToken, accessToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // GET profile
  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
  });

  // Sync profile name to input state
  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile?.name]);

  // UPDATE name
  const updateNameMutation = useMutation({
    mutationFn: () => userService.updateProfile({ name }),
    onSuccess: (data) => {
      toast.success("Name updated!");
      // Update store
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, name: data.name }, accessToken, refreshToken);
      }
      refetch();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  // UPDATE avatar
  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.updateAvatar(file),
    onSuccess: (data) => {
      toast.success("Avatar updated!");
      setAvatarPreview("");
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, avatar: data.avatar }, accessToken, refreshToken);
      }
      refetch();
    },
    onError: () => toast.error("Failed to upload avatar"),
  });

  // CHANGE password
  const changePasswordMutation = useMutation({
    mutationFn: () =>
      userService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    updateAvatarMutation.mutate(file);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    changePasswordMutation.mutate();
  };

  const avatarUrl = avatarPreview || profile?.avatar;
  const initials = (profile?.name || user?.name || "A").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Profile Settings
      </h1>

      {/* ── Avatar + Basic Info ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Account Information
        </h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {initials}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={updateAvatarMutation.isPending}
              className="
                absolute bottom-0 right-0
                w-8 h-8 bg-blue-600 hover:bg-blue-700
                rounded-full flex items-center justify-center
                text-white shadow-lg transition-colors
              "
              title="Change avatar"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info */}
          <div className="flex-1 w-full space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    flex-1 border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-gray-900 dark:text-white
                    rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                />
                <button
                  onClick={() => updateNameMutation.mutate()}
                  disabled={
                    updateNameMutation.isPending || name === profile?.name
                  }
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <User size={14} />
              <span className="text-xs">Role</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {profile?.role?.toLowerCase().replace("_", " ")}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Shield size={14} />
              <span className="text-xs">Status</span>
            </div>
            <span className="text-sm font-semibold text-green-600">Active</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Calendar size={14} />
              <span className="text-xs">Joined</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={18} className="text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Change Password
          </h2>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="
                w-full border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
                w-full border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={
              changePasswordMutation.isPending ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="
              flex items-center gap-2
              bg-blue-600 text-white px-6 py-2 rounded-lg
              hover:bg-blue-700 disabled:opacity-50 text-sm
            "
          >
            <Lock size={14} />
            {changePasswordMutation.isPending
              ? "Changing..."
              : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
