import { MessageCircle } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';

export function NoChatSelected() {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <section className="flex-grow flex flex-col gap-4 p-4 h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <MessageCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium">No conversation selected</p>
          <p className="text-sm">Select a chat to start messaging</p>
        </div>
      </div>
    </section>
  );
}
