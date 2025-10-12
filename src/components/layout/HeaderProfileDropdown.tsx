import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/hooks/useAuth';
import type { User as UserType } from '@/components/auth/types/authTypes';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  user: UserType;
}

export default function HeaderProfileDropdown({ user }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const allowedRoles = ['admin', 'super_admin'];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary">
          <div className="h-full w-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.email.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allowedRoles.includes(user?.role) && (
          <DropdownMenuItem onClick={() => navigate('admin/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
