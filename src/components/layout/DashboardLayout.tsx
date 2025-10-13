import { useAuth } from '@/components/auth/contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ModeToggle from './ModeToggle';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  interface SidebarStateChangeEvent extends CustomEvent {
    detail: { collapsed: boolean };
  }

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarChange = (e: SidebarStateChangeEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener(
      'sidebarStateChange',
      handleSidebarChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'sidebarStateChange',
        handleSidebarChange as EventListener
      );
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '4rem' : '16rem',
        }}
      >
        <header
          className="fixed top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-6"
          style={{
            right: 0,
            left: sidebarCollapsed ? '4rem' : '16rem',
          }}
        >
          <div className="flex-1" />
          <ModeToggle />
          <HeaderProfileDropdown user={user!} />
        </header>
        <main className="pt-14 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
