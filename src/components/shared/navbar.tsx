import { useEffect, useState } from 'react';

import { FlameIcon, MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

export function Navbar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav className="h-20 bg-primary px-6 py-4 text-primary-foreground">
      <div className="w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile ? <MobileNavbar /> : null}
            <Logo />
          </div>
          <div className="hidden lg:block">
            <Link to="/auth/login" className="text-base font-medium">
              Login
            </Link>
            <Link to="/auth/register" className="ml-4 text-base font-medium">
              Register
            </Link>
            <Link to="/preference" className="ml-4 text-base font-medium">
              Preference
            </Link>
          </div>
          <UserProfile />
        </div>
      </div>
    </nav>
  );
}

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <MenuIcon
        className="h-8 w-8"
        role="button"
        onClick={() => setIsOpen(!isOpen)}
      />

      <div
        className={cn(
          'fixed bottom-0 left-0 top-20 z-50 w-60 bg-primary',
          'transition-transform duration-300 ease-in-out',
          { 'translate-x-0': isOpen, '-translate-x-full': !isOpen }
        )}
      >
        <div className="flex h-full flex-col gap-4 px-6 py-8">
          <Link to="/auth/login" className="text-base font-medium">
            Login
          </Link>
          <Link to="/auth/register" className="text-base font-medium">
            Register
          </Link>
          <Link to="/preference" className="text-base font-medium">
            Preference
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <FlameIcon className="mr-2 h-8 w-8" />
      <span className="text-xl font-bold">Profile Match</span>
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
      <div className="ml-3">
        <Link
          to="/profile"
          className="text-base font-medium text-indigo-300 hover:text-white"
        >
          Tom Cook
        </Link>
      </div>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const listener = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
