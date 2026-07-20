import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./button";
import { logoutUser } from "@/services/auth.api";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/constants/routes";

interface NavbarProps {
  leftActions?: ReactNode;
  titleContent?: ReactNode;
}

export default function Navbar({ leftActions, titleContent }: NavbarProps) {
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {leftActions}

        <Link to={APP_ROUTES.HOME} className={`flex items-center space-x-2 font-bold text-lg text-purple-700 hover:opacity-80 transition-opacity ${titleContent ? 'hidden sm:flex border-r border-slate-200 pr-4' : ''}`}>
          <div className="bg-purple-600 text-white p-1 rounded">
            <Scissors className="w-4 h-4" />
          </div>
          <span>SliceDocs</span>
        </Link>

        {titleContent}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-600 font-medium">Hello, {user.name}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white flex items-center justify-center font-medium text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
