import { useAuth } from "@/components/auth/hooks/useAuth";
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
    case "user":
      return <UserDashboard />;
    case "seller":
      return <UserDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
}
