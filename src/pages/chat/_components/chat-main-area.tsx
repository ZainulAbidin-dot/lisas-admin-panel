import { useCallback, useEffect, useRef, useState } from 'react';

import { format, isToday, isYesterday } from 'date-fns';
import { ArrowLeftIcon, Loader2Icon, PhoneIcon, SendIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import useMeasure from 'react-use-measure';

import { LoadingState } from '@/components/loading-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import { MatchContact, type Message, useChatContext } from '../chat-context';

type ChatHeaderProps = {
  name: string;
  profileImage?: string;
  isOnline: boolean;
};

export function ChatHeader({ name, profileImage, isOnline }: ChatHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center justify-between shadow-md pb-2 px-2">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Link to="/chat">
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">Back</span>
          </Link>
        ) : null}
        <Avatar className="w-10 h-10 rounded-full">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            {name
              .split(' ')
              .map((n) => n[0]?.toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            className={cn(
              'font-semibold flex items-center gap-1',
              'after:w-2 after:h-2 after:rounded-full after:bg-primary',
              isOnline ? 'after:bg-green-500' : 'after:bg-red-500'
            )}
          >
            {name}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <PhoneIcon />
      </Button>
    </div>
  );
}

export function Message({
  message,
  user,
}: {
  message: Message;
  user: MatchContact;
}) {
  const currentUserId = useAuthStore((state) => state.token?.decoded?.userId);

  const isOwnMessage = message.senderId === currentUserId;
  const sender = user.userName;
  const time = new Date(message.createdAt);
  const content = message.text;
  const profileImage = user.profileImage;

  return (
    <div
      className={cn(
        'flex  my-2 items-end',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
    >
      {!isOwnMessage && (
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            {sender
              .split(' ')
              .map((n) => n[0]?.toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'relative p-3 max-w-xs rounded-lg',
          isOwnMessage
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground',
          !isOwnMessage ? 'border-l-2 border-secondary' : ''
        )}
      >
        <p className="text-sm">{content}</p>
        <p className="text-xs text-right opacity-70">
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
  );
}

export function ChatMainArea({
  messages,
  chatUser,
  loadMoreMessages,
}: {
  messages: Message[];
  chatUser: MatchContact;
  loadMoreMessages: (abortSignal?: AbortSignal) => Promise<void>;
  isLoadingMore: boolean;
}) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<number>(0);
  const oldMessagesLoaded = useRef(false);
  const [ref, { height: newHeight }] = useMeasure();

  const reversedMessages = [...messages].reverse();
  const groupedMessages: (Message | { type: 'date'; label: string })[] = [];
  let lastDateLabel: string | null = null;

  for (const message of reversedMessages) {
    const messageDate = formatDateLabel(new Date(message.createdAt));

    if (messageDate !== lastDateLabel) {
      groupedMessages.push({ type: 'date', label: messageDate });
      lastDateLabel = messageDate;
    }

    groupedMessages.push(message);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToLast = useCallback(() => {
    if (!scrollContainer.current) return;
    if (newHeight > heightRef.current) {
      scrollContainer.current.scrollTop = newHeight - heightRef.current;
      heightRef.current = newHeight;
    }
  }, [newHeight]);

  useEffect(() => {
    if (!scrollContainer.current || !bottomRef.current) {
      return;
    }
    console.log('layout effect triggered');

    if (oldMessagesLoaded.current) {
      scrollToLast();
      oldMessagesLoaded.current = false;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToLast]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollContainer.current) return;
    if (scrollContainer.current.scrollTop < 500) {
      console.log('SCROLLED TO TOP');
      console.log('scrollTop', e.currentTarget.scrollTop);
      console.log('newHeight', newHeight);
      console.log('oldHeight', heightRef.current);
      await loadMoreMessages();
      oldMessagesLoaded.current = true;
    }
  };

  return (
    <div
      className={cn('px-4 overflow-y-auto h-full', 'chat-scrolling-container')}
      ref={scrollContainer}
      onScroll={handleScroll}
    >
      <div ref={ref}>
        {groupedMessages.map((item, index) =>
          'type' in item ? (
            <div key={index} className="text-center text-gray-500 my-2">
              {item.label}
            </div>
          ) : (
            <Message key={item.id} message={item} user={chatUser} />
          )
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

export function ChatInputArea({
  addMessage,
  isSending,
}: {
  addMessage: (message: string) => Promise<boolean>;
  isSending: boolean;
}) {
  const [input, setInput] = useState('');

  const handleSendMsg = async () => {
    if (!input.trim()) return;
    addMessage(input);
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 py-2 px-2 md:px-2 border-t bg-white shadow-md">
      <Input
        placeholder="Enter Message..."
        className="flex-1 bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
      />
      <Button size="icon" onClick={handleSendMsg} disabled={isSending}>
        {isSending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        <span className="sr-only">Send Message</span>
      </Button>
    </div>
  );
}

export function ChatSection() {
  const { sendMessage, conversationState, loadMoreMessages, onlineUsers } =
    useChatContext();

  const matchId = useParams().matchId!;

  const { chatUser, messages, queryState } = conversationState;

  const isLoading = queryState === 'fetching' || !chatUser;

  if (isLoading) {
    return (
      <section className="flex-grow flex flex-col gap-4 px-2 py-2 h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto">
          <LoadingState />
        </div>
      </section>
    );
  }

  const isSending = conversationState.queryState === 'sending-message';
  const isLoadingMoreMsgs =
    conversationState.queryState === 'loading-more-messages';

  const addMessage = (content: string) => {
    return sendMessage(matchId, content, chatUser.userId);
  };

  return (
    <section className="flex-grow flex flex-col gap-4 px-2 py-2 h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto">
        <ChatHeader
          name={chatUser.userName}
          profileImage={chatUser.profileImage}
          isOnline={onlineUsers.has(chatUser.userId)}
        />

        <ChatMainArea
          messages={messages}
          chatUser={chatUser}
          loadMoreMessages={loadMoreMessages}
          isLoadingMore={isLoadingMoreMsgs}
        />

        <ChatInputArea addMessage={addMessage} isSending={isSending} />
      </div>
    </section>
  );
}

function formatDateLabel(date: Date) {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM dd, yyyy'); // Example: "Feb 15, 2025"
}
