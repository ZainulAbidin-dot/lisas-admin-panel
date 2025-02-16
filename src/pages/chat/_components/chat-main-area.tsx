import { useEffect, useRef, useState } from 'react';

import {
  ArrowLeftIcon,
  MessageCircle,
  PhoneIcon,
  SendIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { Conversation, useChatContext } from '../chat-context';

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
  message: Conversation['messages'][number];
  user: Conversation['chatUser'];
}) {
  const isOwnMessage = message.isOwnMessage;
  const sender = user.userName;
  const time = message.createdAt;
  const content = message.text;
  const profileImage = user.profileImage;

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-2 items-end`}
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
        className={`relative p-3 max-w-xs rounded-lg ${isOwnMessage ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} relative`}
        style={!isOwnMessage ? { borderBottomLeftRadius: 0 } : {}}
      >
        <p className="text-sm">{content}</p>
        <p className="text-xs text-right opacity-70">
          {time.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

export function ChatMainArea({ conversation }: { conversation: Conversation }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages.length]);

  return (
    <ScrollArea className="h-full">
      <div className="p-3 bg-white">
        {conversation.messages.map((msg, index) => (
          <Message key={index} message={msg} user={conversation.chatUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

export function ChatInputArea({
  addMessage,
}: {
  addMessage: (message: string) => void;
}) {
  const [input, setInput] = useState('');

  const handleSendMsg = () => {
    if (!input.trim()) return;
    addMessage(input);
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 pt-2 px-2 md:px-2 border-t bg-white shadow-md">
      <Input
        placeholder="Enter Message..."
        className="flex-1 bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
      />
      <Button size="icon" onClick={handleSendMsg}>
        <SendIcon />
        <span className="sr-only">Send Message</span>
      </Button>
    </div>
  );
}

export function ChatSection() {
  const { conversationState, sendMessage } = useChatContext();

  const conversation = conversationState.data;
  const conversationLoading = conversationState.queryState === 'fetching';

  if (conversationLoading) return <div>Loading...</div>;

  const chatUser = conversation.chatUser;

  return (
    <section
      className={cn(
        'flex-grow flex flex-col gap-4 px-2 py-2 md:py-4 md:px-4 h-full overflow-hidden'
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <ChatHeader
          name={chatUser.userName}
          profileImage={chatUser.profileImage}
          isOnline={true} // TODO: Add isOnline state
        />
        <ChatMainArea conversation={conversation} />
        <ChatInputArea addMessage={sendMessage} />
      </div>
    </section>
  );
}

export function EmptyChatArea() {
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
