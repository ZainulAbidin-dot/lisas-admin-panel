import { Loader2Icon } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2Icon className="animate-spin text-primary max-w-5 aspect-square mx-auto" />
    </div>
  );
}
