import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./button";
import { logoutUser } from "@/services/auth.api";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-slate-200">
      <div className="font-bold text-xl text-slate-800">SliceDocs</div>
      <div className="flex items-center gap-4">
        {user && <span className="text-slate-600 font-medium">Hello, {user.name}</span>}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
