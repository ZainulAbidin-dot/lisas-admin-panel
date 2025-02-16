import { Outlet, useParams } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { ChatListItem } from './_components/chat-list-item';
import { ChatProvider, useChatContext } from './chat-context';

function ChatSidebar() {
  const {
    contactsState: { data: contacts },
  } = useChatContext();
  const isMobile = useIsMobile();

  const { matchId } = useParams();

  return (
    <ScrollArea
      className={cn(
        'w-1/4 min-w-80 h-full border-r',
        isMobile ? (matchId ? 'hidden' : 'w-full') : ''
      )}
    >
      {/* Search bar */}
      <div className="px-2 py-2 md:py-4 md:px-4">
        <Input
          placeholder="Search contacts..."
          className="bg-transparent mb-4"
          onKeyDown={(e) => e.key === 'Enter' && console.log('Search')}
        />

        <div className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <ChatListItem key={contact.matchId} contact={contact} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

export function ChatLayout() {
  return (
    <ChatProvider>
      <div className="flex-grow">
        <div
          className={cn(
            'flex gap-4',
            'h-[calc(100vh-4rem-3.5rem)]',
            'h-[calc(100svh-4rem-3.5rem)]',
            'overflow-y-auto'
          )}
        >
          <ChatSidebar />

          <Outlet />
        </div>
      </div>
    </ChatProvider>
  );
}
