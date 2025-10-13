import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/components/auth/contexts/AuthContext";
import { Toaster } from "@/components/ui/common-ui/sonner-toaster";
import { useAuth } from "@/components/auth/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardPage from "@/pages/dashboard/Dashboard";
import Unauthorized from "@/components/layout/Unauthorized";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage"

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes (for authenticated users only) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "user", "seller", "super_admin"]}
          >
              <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

      </Route>


      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
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
