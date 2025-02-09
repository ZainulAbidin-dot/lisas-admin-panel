import { Outlet, Route, Routes, useParams } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { ChatListItem } from './_components/chat-list-item';
import { ChatSection, EmptyChatArea } from './_components/chat-main-area';
import { ChatProvider, useChatContext } from './chat-context';

export function ChatPage() {
  return (
    <ChatProvider>
      <Routes>
        <Route element={<ChatLayout />}>
          <Route index element={<EmptyChatArea />} />
          <Route path=":id" element={<ChatSection />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
}

function ChatSidebar() {
  const { contacts } = useChatContext();
  const isMobile = useIsMobile();
  const { id } = useParams();
  return (
    <ScrollArea
      className={cn(
        'w-1/4 min-w-80 h-full py-4 px-4',
        isMobile ? (id ? 'hidden' : 'w-full') : ''
      )}
    >
      <div className="flex flex-col gap-2">
        {contacts.map((contact) => (
          <ChatListItem key={contact.user.id} contact={contact} />
        ))}
      </div>
    </ScrollArea>
  );
}

function ChatLayout() {
  return (
    <div className="flex-grow">
      <div
        className={cn(
          'flex gap-4',
          'h-[calc(100vh-5rem-3.5rem)]',
          'overflow-y-auto'
        )}
      >
        <ChatSidebar />

        <Outlet />
      </div>
    </div>
  );
}
