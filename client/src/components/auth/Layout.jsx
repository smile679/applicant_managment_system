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

const LoginUser = () => {
  const [ formData, setFormData] = useState({ email: "admin@infnova.tech", password: "InternChallenge2026!" });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const navigate = useNavigate()
  const { login } = useAuth();

  const [ searchParams, setSearchParams ] = useSearchParams();

  useEffect(()=>{
     if (searchParams.get("expired") === "true") {
       toast.error("token expired!", {
         position: "top-right",
       });
     }
  },[searchParams])

  const handleSubmit = async(e) => {
    e.preventDefault();
    
     try {
       setIsLoading(true);
       const res = await loginUser(formData);
       console.log(res.data.user);

       if (res.data.user) {
          login(res.data.accessToken, res.data.user);

          toast.success("user successfully login..", {
           position: "top-right",
         });
        
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
    <section className="w-full min-h-screen bg-blue-500 flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="**********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="w-full mt-5 flex flex-col justify-center items-center gap-y-1">
              <p className=" text-red-500 text-sm">
                { error || null }
              </p>
              <Button
                type="submit"
                className="w-full rounded-md cursor-pointer"
                disabled={isLoading}
              >
                { isLoading ? <span>Logging...</span> : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginUser;
