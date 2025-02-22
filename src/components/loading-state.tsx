import { Loader2Icon } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="mx-auto aspect-square w-full max-w-10 animate-spin text-primary" />
    </div>
  );
}
