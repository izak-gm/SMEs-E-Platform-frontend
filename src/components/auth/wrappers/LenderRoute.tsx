// components/auth/wrappers/LenderOnly.tsx
import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { BusinessProvider } from "../contexts/LenderBusinessContext";

interface LenderOnlyProps {
  children: ReactNode;
}

export default function LenderRoutes({ children }: LenderOnlyProps) {
  const { user } = useAuth();

  if (user?.role === "lender" || "agent") {
    return <BusinessProvider>{children}</BusinessProvider>;
  }

  return <>{children}</>;
}
