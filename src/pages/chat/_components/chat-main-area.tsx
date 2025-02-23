import React, { useRef, useState } from 'react';

import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ArrowLeftIcon, Loader2Icon, PhoneIcon, SendIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LoadingState } from '@/components/loading-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import {
  ChatUser,
  Message,
  type Message as MessageComponent,
  useChatContext,
} from '../chat-context';

export function ChatSection() {
  const { conversationState } = useChatContext();

  const isLoading =
    (conversationState.queryState === 'fetching' &&
      conversationState.messages.length === 0) ||
    !conversationState.chatUser;

  if (isLoading) {
    return (
      <section className="flex h-full flex-grow flex-col gap-4 overflow-hidden px-2 py-2">
        <div className="flex h-full flex-col overflow-y-auto">
          <LoadingState />
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-grow flex-col gap-4 overflow-hidden px-2 py-2">
      <div className="flex h-full flex-col overflow-y-auto">
        <ChatHeader />

        <ChatMainArea />

        <ChatInputArea />
      </div>
    </section>
  );
}

function ChatHeader() {
  const isMobile = useIsMobile();

  const { conversationState, onlineUsers } = useChatContext();

  const { userName, profileImage } = conversationState.chatUser!;

  const isOnline = onlineUsers.has(conversationState.chatUser!.userId);

  return (
    <div className="flex items-center justify-between px-2 pb-2 shadow-md">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Link to="/chat">
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">Back</span>
          </Link>
        ) : null}
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarImage src={profileImage} />
          <AvatarFallback>{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <div>
          <p
            className={cn(
              'flex items-center gap-1 font-semibold',
              'after:h-2 after:w-2 after:rounded-full after:bg-primary',
              isOnline ? 'after:bg-green-500' : 'after:bg-red-500'
            )}
          >
            {userName}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <PhoneIcon />
      </Button>
    </div>
  );
}

const MessageComponent = React.forwardRef<
  HTMLDivElement,
  { message: Message; user: ChatUser; showDateSeparator: boolean }
>(({ message, user, showDateSeparator }, ref) => {
  const currentUserId = useAuthStore((state) => state.token?.decoded?.userId);

  const isOwnMessage = message.senderId === currentUserId;
  const sender = user.userName;
  const time = new Date(message.createdAt);
  const content = message.text;
  const profileImage = user.profileImage;

  return (
    <>
      {showDateSeparator ? <DateSeparator date={time} /> : null}
      <div
        className={cn(
          'my-2 flex items-end',
          isOwnMessage ? 'justify-end' : 'justify-start'
        )}
        ref={ref}
      >
        {!isOwnMessage && (
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{getInitials(sender)}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            'relative max-w-xs rounded-lg p-3',
            isOwnMessage
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground',
            !isOwnMessage ? 'border-l-2 border-secondary' : ''
          )}
        >
          <p className="text-sm">{content}</p>
          <p className="text-right text-xs opacity-70">
            {time.toLocaleDateString(undefined, {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}{' '}
            {time.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </>
  );
});

function ChatMainArea() {
  const { conversationState } = useChatContext();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { messages, loadMoreMessages, chatUser, hasMore, page, queryState } =
    conversationState;

  function handleScroll() {
    const { scrollHeight, scrollTop, clientHeight } =
      messageContainerRef.current!;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (queryState === 'idle' && hasMore) {
        loadMoreMessages(page);
      }
    }
  }

  let visitedDate: Date | null = null;

  return (
    <div
      className={cn(
        'h-full -scale-y-100 overflow-y-scroll px-4',
        'chat-scrolling-container'
      )}
      ref={messageContainerRef}
      onScroll={handleScroll}
    >
      <div className="-scale-y-100">
        {messages.map((item) => {
          let showDateSeparator = false;
          if (
            !visitedDate ||
            !isSameDay(visitedDate, new Date(item.createdAt))
          ) {
            visitedDate = new Date(item.createdAt);
            showDateSeparator = true;
          }

          return (
            <MessageComponent
              key={item.id}
              message={item}
              user={chatUser!}
              showDateSeparator={showDateSeparator}
            />
          );
        })}
      </div>
      {queryState === 'fetching' ? <LoadingState /> : null}
    </div>
  );
}

function DateSeparator({ date }: { date: Date }) {
  return (
    <div className={cn('flex items-center justify-between gap-2 px-2 py-2')}>
      <hr className="flex-grow" />
      <p className="text-sm">{formatDateLabel(date)}</p>
      <hr className="flex-grow" />
    </div>
  );
}

function ChatInputArea() {
  const [input, setInput] = useState('');

  const {
    sendMessage,
    conversationState: { chatUser },
  } = useChatContext();

  const handleSendMsg = async () => {
    if (!input.trim()) return;
    sendMessage.fn(chatUser!.matchId, input, chatUser!.userId);
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 border-t bg-white px-2 py-2 shadow-md md:px-2">
      <Input
        placeholder="Enter Message..."
        className="flex-1 bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
      />
      <Button
        size="icon"
        onClick={handleSendMsg}
        disabled={sendMessage.isSending}
      >
        {sendMessage.isSending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <SendIcon />
        )}
        <span className="sr-only">Send Message</span>
      </Button>
    </div>
  );
}

function formatDateLabel(date: Date) {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM dd, yyyy'); // Example: "Feb 15, 2025"
}
