import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { logoutUser } from "../../api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      toast.success("Logged out successfully.");
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-background">
      {/* Mobile menu trigger — hidden on desktop, sidebar is always visible there */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <FiMenu className="size-5" />
      </Button>

      {/* Spacer keeps profile block right-aligned on desktop where menu button is hidden */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-blue-600 leading-tight">
            {user?.fullName}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {user?.email}
          </p>
        </div>
        <Avatar className="size-9">
          <AvatarFallback className="font-bold text-sm">
            {user?.fullName
              ?.split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          className="hover:scale-110 transition-transform"
          onClick={handleLogout}
          title="Log out"
        >
          <FiLogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;