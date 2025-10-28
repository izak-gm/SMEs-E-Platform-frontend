import { useAuth } from "@/components/auth/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import UserDashboard from "./user/UserDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    // case "admin":
    //   return <AdminDashboard />;
    // case "super_admin":
    //   return <AdminDashboard />;
    case "ROLE_USER":
      return <UserDashboard />;
    case "ROLE_SELLER":
      return <UserDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
}
