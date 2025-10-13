import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/common-ui/sonner-toaster";
import {AuthProvider,useAuth } from "@/components/auth/contexts/AuthContext.tsx";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardPage from "@/pages/dashboard/Dashboard";
import Unauthorized from "@/components/layout/Unauthorized";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SigninWrapper />} />
      <Route path="/signup" element={<SignupWrapper />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ROLE_ADMIN",
              "ROLE_USER",
              "ROLE_SELLER",
              "ROLE_SUPER_ADMIN",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

      </Route>
    </Routes>
  );
};

// Wrappers to use useAuth safely
const SigninWrapper = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const SignupWrapper = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <RegisterPage />;
};


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

