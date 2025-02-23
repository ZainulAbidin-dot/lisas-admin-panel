import { useCallback, useState } from 'react';

import { Outlet, useParams } from 'react-router-dom';

import { LoadingState } from '@/components/loading-state';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { ChatListItem } from './_components/chat-list-item';
import { ChatProvider, MatchContact, useChatContext } from './chat-context';

function ChatSidebar() {
  const { matchContactState, onlineUsers } = useChatContext();
  const isMobile = useIsMobile();
  const { matchId } = useParams();

  const [searchQuery, setSearchQuery] = useState('');

  const filterFn = useCallback((contact: MatchContact, query: string) => {
    console.log('Filtering: ', query);
    return contact.userName.toLowerCase().includes(query.toLowerCase());
  }, []);

  const filteredContacts = useDebouncedSearch(
    matchContactState.data,
    searchQuery,
    filterFn,
    500
  );

  return (
    <ScrollArea
      className={cn(
        'h-full w-1/5 min-w-64 border-r',
        isMobile ? (matchId ? 'hidden' : 'w-full') : ''
      )}
    >
      {/* Search bar */}
      <div className="px-2 py-2 md:px-4 md:py-4">
        <Input
          placeholder="Search contacts..."
          className="mb-4 bg-transparent"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {matchContactState.queryState === 'fetching' ? <LoadingState /> : null}

        <div className="flex flex-col gap-2">
          {filteredContacts.map((contact) => (
            <ChatListItem
              key={contact.matchId}
              contact={contact}
              isOnline={onlineUsers.has(contact.userId)}
            />
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
