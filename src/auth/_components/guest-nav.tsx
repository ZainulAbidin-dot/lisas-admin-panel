import { Logo } from '@/components/shared/navbar';
import { cn } from '@/lib/utils';

export function GuestNav() {
  return (
    <nav
      className={cn(
        'bg-primary text-primary-foreground',
        'flex h-16 items-center px-2 sm:px-4'
      )}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
        </div>
      </div>
    </nav>
  );
}
