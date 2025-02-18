import { Link, useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { type MatchContact } from '../chat-context';

export function ChatListItem({
  contact,
  isOnline,
}: {
  contact: MatchContact;
  isOnline: boolean;
}) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('');
  };

  const params = useParams();
  const id = params.id;

  return (
    <Link to={`/chat/${contact.matchId}`}>
      <div
        className={cn(
          'flex items-center justify-between gap-2 px-1 py-1 md:px-2 md:py-2 hover:bg-gray-100 rounded-lg cursor-pointer',
          id === contact.matchId ? 'bg-gray-200 hover:bg-gray-300' : ''
        )}
      >
        <div className="flex items-center gap-2">
          {/* Profile Image or Fallback */}
          <div className="relative">
            <Avatar className="w-10 h-10 rounded-full">
              <AvatarImage src={contact.profileImage} />
              <AvatarFallback>{getInitials(contact.userName)}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{contact.userName}</p>
          </div>
        </div>

        {/* Last Message Time and Unread Count */}
        <div className="text-right flex-shrink-0 flex flex-col gap-2">
          {contact.unreadMsgCount > 0 && (
            <Badge
              className="text-white text-xs px-2 py-1 rounded-full w-fit ml-auto"
              variant="destructive"
            >
              {contact.unreadMsgCount <= 9 ? contact.unreadMsgCount : '9+'}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
