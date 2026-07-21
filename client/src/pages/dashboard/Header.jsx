import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "../../api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  
  const handleLogout = async () => {
    try {
       await logoutUser(token);
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      toast.success("Logged out successfully.", {
        position: "top-right",
      });
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <section className="w-full flex justify-end px-5 py-5">
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="size-10">
          <AvatarFallback className="font-bold">
            {user?.fullName
              ?.split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-md font-bold text-blue-500 tracking-normal">
            {user?.fullName}
          </p>
          <p className="text-sm font-normal">{user?.email}</p>
        </div>
        <div className="">
          <Button
            variant="none"
            className="cursor-pointer hover:scale-110"
            onClick={handleLogout}
          >
            <FiLogOut className="size-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Header;
