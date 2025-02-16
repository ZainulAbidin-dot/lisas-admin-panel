import { Link, useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { type ChatUser } from '../chat-context';

export function ChatListItem({ contact }: { contact: ChatUser }) {
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
            {/* {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            )} */}
          </div>

          {/* Name and Last Message */}
          <div>
            <p className="font-semibold text-gray-900">{contact.userName}</p>
            {/* <p
              className={cn(
                'text-sm text-gray-500 truncate w-[15ch] overflow-hidden',
                contact.user.unreadMessages > 0 ? 'font-semibold' : ''
              )}
            >
              {contact.lastMessage?.text || 'No message yet'}
            </p> */}
          </div>
        </div>

        {/* Last Message Time and Unread Count */}
        {/* <div className="text-right flex-shrink-0 flex flex-col gap-2">
          <p className="text-xs text-gray-400">
            {contact.lastMessage
              ? formatRelativeTime(new Date(contact.lastMessage.createdAt))
              : ''}
          </p>
          {contact.user.unreadMessages > 0 && (
            <Badge
              className="text-white text-xs px-2 py-1 rounded-full w-fit ml-auto"
              variant="destructive"
            >
              {contact.user.unreadMessages}
            </Badge>
          )}
        </div> */}
      </div>
    </Link>
  );
}

// function formatRelativeTime(date: Date) {
//   const diff = Date.now() - date.getTime();
//   const absDiff = Math.abs(diff);
//   const absDiffInSeconds = Math.round(absDiff / 1000);
//   const absDiffInMinutes = Math.round(absDiffInSeconds / 60);
//   const absDiffInHours = Math.round(absDiffInMinutes / 60);
//   const absDiffInDays = Math.round(absDiffInHours / 24);

//   if (absDiffInSeconds < 60) {
//     return 'Just now';
//   }

//   if (absDiffInMinutes < 60) {
//     return absDiffInMinutes + ' minutes ago';
//   }

//   if (absDiffInHours < 24) {
//     return absDiffInHours + ' hours ago';
//   }

//   if (absDiffInDays < 7) {
//     return absDiffInDays + ' days ago';
//   }

//   return '';
// }
