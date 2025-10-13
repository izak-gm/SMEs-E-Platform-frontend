import {
  Home,
  Users,
  BarChart,
  CheckCircle,
  FileText,
  HelpCircle,
  User,
  TicketSlash,
  UserRoundPen,
  Banknote,
  PiggyBank,
  Handshake,
} from 'lucide-react';
import type { UserRole } from '@/components/auth/types/authTypes';
import { NavGroup } from '../types/DashboardLayoutTypes';

const adminNavigation: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [{ title: 'Home', href: '/dashboard', icon: Home }],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      {
        title: 'Admins',
        href: '/dashboard/admin/all',
        icon: Users,
      },
      {
        title: 'Lenders',
        href: '/dashboard/lenders',
        icon: Users,
      },
      {
        title: 'Lender Businesses',
        href: '/dashboard/admin/lender-business',
        icon: Users,
      },
      {
        title: 'Agents',
        href: '/dashboard/admin/agents',
        icon: Users,
      },
      // {
      //   title: 'Borrowers',
      //   href: '/dashboard/fine',
      //   icon: Users,
      // },
    ],
  },
  {
    title: 'APPROVAL',
    items: [
      {
        title: 'Lender Approval',
        href: '/dashboard/approve-lender',
        icon: User,
      },
    ],
  },
  {
    title: 'TRANSACTIONS',
    items: [
      {
        title: 'STK Callbacks',
        href: '/dashboard/admin/view-stkcallbacks',
        icon: CheckCircle,
      },
      {
        title: 'Confirmation Callbacks',
        href: '/dashboard/admin/view-confirmcallbacks',
        icon: CheckCircle,
      },
      {
        title: 'B2C Callbacks',
        href: '/dashboard/admin/view-b2ccallbacks',
        icon: TicketSlash,
      },
      // {
      //   title: 'Wallets',
      //   href: '/dashboard/fine',
      //   icon: TicketSlash,
      // },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        title: 'Business Types',
        href: '/dashboard/business-types',
        icon: CheckCircle,
      },
      {
        title: 'Regions',
        href: '/dashboard/add/lender/region',
        icon: CheckCircle,
      },
    ],
  },
  {
    title: 'USER & REPORTS',
    items: [
      {
        title: 'Reports',
        href: '/dashboard/reports',
        icon: BarChart,
        subItems: [
          {
            title: 'All Lenders',
            href: '/dashboard/reports/all-lenders',
            icon: BarChart,
          },
          {
            title: 'Borrowers per Lender',
            href: '/dashboard/reports/borrowers-per-lender',
            icon: BarChart,
          },
          {
            title: 'LenderBusinesses',
            href: '/dashboard/reports/businesses-per-lender',
            icon: BarChart,
          },
          {
            title: 'Agents Per Business',
            href: '/dashboard/reports/agents-per-business',
            icon: BarChart,
          },
          {
            title: 'Capital per Lender',
            href: '/dashboard/reports/capital-per-lender',
            icon: BarChart,
          },
          {
            title: 'Lender Activity',
            href: '/dashboard/reports/lender-activity',
            icon: BarChart,
          },
          {
            title: 'Agent Activity',
            href: '/dashboard/reports/agent-activity',
            icon: BarChart,
          },
          {
            title: 'Loan Performance',
            href: '/dashboard/reports/loan-performance',
            icon: BarChart,
          },
          {
            title: 'Loans per Lender',
            href: '/dashboard/reports/loans-per-lender',
            icon: BarChart,
          },
          {
            title: 'Revenue per Lender',
            href: '/dashboard/reports/revenue-per-lender',
            icon: BarChart,
          },
          {
            title: 'User Growth',
            href: '/dashboard/reports/user-growth',
            icon: BarChart,
          },
        ],
      },
    ],
  },
];

const lenderNavigation: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [{ title: 'Home', href: '/dashboard', icon: Home }],
  },
  {
    title: 'LOAN MANAGEMENT',
    items: [
      {
        title: 'Loans',
        href: '/dashboard/loans',
        icon: CheckCircle,
      },
      {
        title: 'Approve Loans',
        href: '/dashboard/approve-loan',
        icon: CheckCircle,
      },
      {
        title: 'Loan Refunds',
        href: '/dashboard/refunds',
        icon: TicketSlash,
      },
      {
        title: 'Fine',
        href: '/dashboard/fine',
        icon: TicketSlash,
      },
    ],
  },
  {
    title: 'AGENT MANAGEMENT',
    items: [
      {
        title: 'Agents',
        href: '/dashboard/agent/register',
        icon: User,
      },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { title: 'Add Money', href: '/dashboard/mpesa/inject', icon: PiggyBank },
      {
        title: 'Withdraw Funds',
        href: '/dashboard/mpesa/withdrawal',
        icon: Banknote,
      },
    ],
  },
  {
    title: 'LOGISTICS',
    items: [
      {
        title: 'Manual match',
        href: '/dashboard/manual-match',
        icon: Handshake,
      },
      {
        title: 'Repayments',
        href: '/dashboard/repayments',
        icon: Handshake,
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        title: 'Loan Plan ',
        href: '/dashboard/loanplan/add',
        icon: FileText,
      },
      {
        title: ' Repayment Cycle',
        href: '/dashboard/add/lenderbusiness/repayment-cycle',
        icon: FileText,
      },
      {
        title: 'Register New Business',
        href: '/dashboard/lender-business-register',
        icon: TicketSlash,
      },
      {
        title: ' Business Area',
        href: '/dashboard/lenderbusinessarea/add',
        icon: TicketSlash,
      },
    ],
  },
  {
    title: 'User & Reports',
    items: [
      { title: 'My Profile', href: '/dashboard/lender/profile', icon: User },
      { title: 'Reports', href: '/dashboard/lender-reports', icon: BarChart },
    ],
  },
];

const agentNavigation: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [{ title: 'Home', href: '/dashboard', icon: Home }],
  },
  {
    title: 'Client Management',
    items: [
      {
        title: 'Borrowers',
        href: '/dashboard/borrowers',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Loan Management',
    items: [
      {
        title: 'Loan Application',
        href: '/dashboard/loan-application',
        icon: FileText,
      },
      {
        title: 'Loan Plan ',
        href: '/dashboard/loanplan/add',
        icon: FileText,
      },
      {
        title: 'Loan Files',
        href: '/dashboard/loan-agreement',
        icon: CheckCircle,
      },
      {
        title: 'Follow Up',
        href: '/dashboard/follow-up',
        icon: UserRoundPen,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'My Profile', href: '/dashboard/agent/profile', icon: User },
      { title: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
    ],
  },
];

export const getNavigationForRole = (role: UserRole): NavGroup[] => {
  switch (role) {
    case 'admin':
      return adminNavigation;
    case 'super_admin':
      return adminNavigation;
    case 'lender':
      return lenderNavigation;
    case 'agent':
      return agentNavigation;
    default:
      return [];
  }
};
