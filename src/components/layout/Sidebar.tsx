'use client';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/hooks/useAuth';
import { getNavigationForRole } from './config/navigation-items';
import MainNav from './MainNav';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigationGroups = getNavigationForRole(user?.role || 'admin');
  const location = useLocation();

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }

    const event = new CustomEvent('sidebarStateChange', {
      detail: { collapsed: isCollapsed },
    });
    window.dispatchEvent(event);
  }, [isCollapsed, onCollapseChange]);

  if (!location.pathname.startsWith('/dashboard') || !user) {
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-30 h-screen flex flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex top-5 items-center border-b px-10 shrink-0">
        <Link
          to="/dashboard"
          className={cn(
            'flex items-center gap-2',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="h-6 w-6 rounded-lg bg-primary" />
          {!isCollapsed && <span className="font-semibold">
            {/* <img src={jazaplanLogo} alt="JazaPlan" className='p-4'/> */}
          </span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          'flex-1 overflow-y-auto p-4',
          isCollapsed && 'items-center px-2'
        )}
      >
        {isCollapsed ? (
          <nav className="space-y-2">
            {navigationGroups.flatMap((group) =>
              group.items.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="w-full"
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </Button>
              ))
            )}
          </nav>
        ) : (
          <MainNav groups={navigationGroups} />
        )}
      </div>
    </div>
  );
}
