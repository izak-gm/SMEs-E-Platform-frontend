import {
  Home,
} from "lucide-react";
import type { UserRole } from "@/components/auth/types/authTypes";
import { NavGroup } from "../types/DashboardLayoutTypes";

const adminNavigation: NavGroup[] = [
  {
    title: "Dashboard",
    items: [{ title: "Home", href: "/dashboard", icon: Home }],
  },
];

const buyerNavigation: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Home", href: "/dashboard", icon: Home },
      { title: "Update Profile", href: "/dashboard/update-profile", icon: Home }],
  },
 
];

const sellerNavigation: NavGroup[] = [
  {
    title: "Dashboard",
    items: [{ title: "Home", href: "/dashboard", icon: Home }],
  },
];

export const getNavigationForRole = (role: UserRole): NavGroup[] => {
  switch (role) {
    case "ROLE_ADMIN":
      return adminNavigation;
    case "ROLE_SUPER_ADMIN":
      return adminNavigation;
    case "ROLE_USER":
      return buyerNavigation;
    case "ROLE_SELLER":
      return sellerNavigation;
    default:
      return [];
  }
};
