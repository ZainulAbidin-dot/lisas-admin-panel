import { Link, useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

import { type MatchContact } from '../chat-context';

export function ChatListItem({
  contact,
  isOnline,
}: {
  contact: MatchContact;
  isOnline: boolean;
}) {
  const params = useParams();
  const matchId = params.matchId;

  return (
    <ChatListItemTrigger matchId={contact.matchId}>
      <div
        className={cn(
          'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1 hover:bg-gray-100 md:px-2 md:py-2',
          matchId === contact.matchId ? 'bg-gray-200 hover:bg-gray-300' : ''
        )}
      >
        <div className="flex items-center gap-2">
          {/* Profile Image or Fallback */}
          <div className="relative">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src={contact.profileImage} />
              <AvatarFallback>{getInitials(contact.userName)}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-white bg-green-500" />
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{contact.userName}</p>
          </div>
        </div>

        {/* Unread Count */}
        <div className="flex flex-shrink-0 flex-col gap-2 text-right">
          {contact.unreadMsgCount > 0 && (
            <Badge
              className="ml-auto w-fit rounded-full px-2 py-1 text-xs text-white"
              variant="destructive"
            >
              {contact.unreadMsgCount <= 9 ? contact.unreadMsgCount : '9+'}
            </Badge>
          )}
        </div>
      </div>
    </ChatListItemTrigger>
  );
}

function ChatListItemTrigger({
  matchId,
  children,
}: {
  matchId: string;
  children: React.ReactNode;
}) {
  return <Link to={`/chat/${matchId}`}>{children}</Link>;
}
