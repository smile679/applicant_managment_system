import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { loginUser } from "../../api/auth";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdBiotech } from "react-icons/md";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { FiLoader } from "react-icons/fi";

const LoginUser = () => {
  const [formData, setFormData] = useState({
    email: "admin@infnova.tech",
    password: "InternChallenge2026!",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.error("token expired!", { position: "top-right" });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await loginUser(formData);
      console.log(res.data.user);

      if (res.data.user) {
        login(res.data.accessToken, res.data.user);
        toast.success("user successfully login..", { position: "top-right" });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex bg-muted/30">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <MdBiotech className="size-10" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">APPLICANT</h1>
            <p className="text-xs tracking-widest text-blue-200">MANAGEMENT</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Manage internship applicants, all in one place.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Search, filter, and review candidates. Update statuses and track
            your pipeline from a single dashboard.
          </p>
        </div>

        <p className="text-xs text-blue-200">
          © {new Date().getFullYear()} INFNOVA Technologies
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm border-none shadow-lg lg:shadow-none lg:border">
          <CardHeader className="space-y-1">
            {/* Logo shown only on mobile */}
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <MdBiotech className="size-8 text-blue-600" />
              <span className="font-bold">APPLICANT</span>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your admin account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="pl-9"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="pl-9 pr-9"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <HiEyeOff className="size-4" />
                      ) : (
                        <HiEye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full mt-6 flex flex-col gap-3">
                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 rounded-md py-2 px-3">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-md cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <FiLoader className="size-4 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );s
};

export default LoginUser;
