import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useUser } from "../../context/UserContext";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-neutral-100 shadow-[0_8px_40px_rgba(0,0,0,0.07)] p-8 flex flex-col items-center gap-6">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-3xl font-semibold text-amber-600 select-none">
          {user?.email?.[0].toUpperCase() ?? "?"}
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-800">
            {user?.user_metadata?.full_name ?? "Rider"}
          </p>
          <p className="text-sm text-neutral-400 mt-0.5">{user?.email}</p>
        </div>

        <div className="w-full h-px bg-neutral-100" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="
            w-full flex items-center justify-center gap-2 py-3 rounded-full
            border border-red-100 bg-red-50 text-red-500 text-sm font-semibold
            hover:bg-red-100 active:scale-[0.98] transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          "
        >
          <LogOut className="w-4 h-4" />
          {isLoading ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
