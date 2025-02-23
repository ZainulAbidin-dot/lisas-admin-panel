import { MessageCircle } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';

export function NoChatSelected() {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <section className="flex h-full flex-grow flex-col gap-4 overflow-hidden p-4">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
          <MessageCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium">No conversation selected</p>
          <p className="text-sm">Select a chat to start messaging</p>
        </div>
      </div>
    </section>
  );
}
