import { useEffect, useState } from 'react';

import { FlameIcon, MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Profile', href: '/profile' },
  { name: 'Create Profile', href: '/profile/create' },
  { name: 'Find Match', href: '/profile/find-match' },
];

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
          <div className="hidden lg:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-base font-medium"
              >
                {link.name}
              </Link>
            ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-base font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  const isMobile = useMediaQuery('(max-width: 768px)');
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
