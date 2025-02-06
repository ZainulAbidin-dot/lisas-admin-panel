import { FlameIcon, PanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function Navbar() {
  return (
    <nav className="h-20 bg-primary px-6 py-4 text-primary-foreground">
      <div className="w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ToggleSidebarButton />
            <Logo />
          </div>
          <UserProfile />
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
