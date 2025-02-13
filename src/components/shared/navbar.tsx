import { FlameIcon, PanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function Navbar() {
  const { userHasSubscription, token } = useAuthStore();
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
          {token ? <UserProfile /> : null}
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
      <PanelLeft className="!size-8" />
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

function UserProfile() {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full"
          src="https://www.gravatar.com/avatar/"
          alt=""
        />
      </div>
    </div>
  );
}
