import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavGroup, NavItem } from './types/DashboardLayoutTypes';

interface MainNavProps {
  groups: NavGroup[];
}

export default function MainNav({ groups }: MainNavProps) {
  const location = useLocation();

  const renderNavItem = (item: NavItem) => {
    if (item.subItems) {
      return (
        <Collapsible key={item.href}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group relative flex w-full justify-start"
            >
              <div className="flex w-full items-center">
                <span className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 px-2">
            {item.subItems.map((subItem) => (
              <Button
                key={subItem.href}
                variant="ghost"
                asChild
                className={cn(
                  'w-full justify-start',
                  location.pathname === subItem.href && 'bg-accent'
                )}
              >
                <Link to={subItem.href}>
                  <subItem.icon className="mr-2 h-4 w-4" />
                  {subItem.title}
                </Link>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.href}
        variant="ghost"
        asChild
        className={cn(
          'w-full justify-start',
          location.pathname === item.href && 'bg-accent'
        )}
      >
        <Link to={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      </Button>
    );
  };

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.title} className="space-y-3">
          <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </h4>
          <div className="space-y-1">{group.items.map(renderNavItem)}</div>
        </div>
      ))}
    </nav>
  );
}
