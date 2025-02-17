import { FlameIcon, LogOutIcon, PanelLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLogout } from '@/auth/_hooks/use-logout';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function Navbar() {
  const { token } = useAuthStore();

  const userHasSubscription = token?.decoded.hasActiveSubscription;

  return (
    <nav
      className={cn(
        'bg-primary text-primary-foreground',
        'h-16 px-2 sm:px-4 flex items-center'
      )}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userHasSubscription ? <ToggleSidebarButton /> : null}
            <Logo />
          </div>
          {token ? <LogoutButton /> : null}
        </div>
      </div>
    </nav>
  );
}

function ToggleSidebarButton() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      title={open ? 'Close sidebar' : 'Open sidebar'}
    >
      <PanelLeftIcon className="!size-8" />
    </Button>
  );
}

export function Logo() {
  const isMobile = useIsMobile();
  return (
    <Link to="/" className="flex items-center">
      <FlameIcon className="mr-2 h-8 w-8" />
      <span
        className={cn('text-xl font-bold', { 'hidden md:block': isMobile })}
      >
        Lisa's Friend
      </span>
    </Link>
  );
}

function LogoutButton() {
  const logout = useLogout();

  return (
    <Button variant="ghost" onClick={logout} title="Logout">
      <LogOutIcon />
      <span>Logout</span>
    </Button>
  );
}
