import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginUser from "./components/auth/Layout";
import { Toaster } from "@/components/ui/sonner";
import DashboardLayout from "./components/dashboard/Layout";
import Applicants from "./pages/dashboard/Applicants";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

function App() {

  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("auth/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <section className="w-full min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />
          }
        />
        <Route path="/auth/login" element={ token ? <Navigate to="/dashboard"/> : <LoginUser />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="applicants" element={<Applicants />} />
          </Route>
        </Route>
        <Route path="*" element={ <Navigate to="/auth/login" />} />
      </Routes>
      <Toaster />
    </section>
  );
}

export default App;