import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { useSocket } from '@/context/socket-context';
import { useAxiosGet } from '@/hooks/use-axios-get';
import { handleAxiosError } from '@/lib/handle-api-error';

const getMatchContactsSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  data: z.object({
    matchContacts: z.array(
      z.object({
        matchId: z.string(),
        userId: z.string(),
        userRole: z.enum(['user', 'admin']),
        userName: z.string(),
        isVerified: z.boolean(),
        unreadMsgCount: z.number(),
        profileImage: z.string().optional(),
      })
    ),
  }),
});

const getChatUser = z.object({
  message: z.string(),
  statusCode: z.number(),
  data: z.object({
    user: z.object({
      matchId: z.string(),
      userId: z.string(),
      userName: z.string(),
      profileImage: z.string().optional(),
      isVerified: z.boolean(),
    }),
  }),
});

const getChatMessagesSchema = z.array(
  z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    createdAt: z.string(),
  })
);

type TGetMatchContact = z.infer<typeof getMatchContactsSchema>;

export type MatchContact = TGetMatchContact['data']['matchContacts'][number];

type TGetChatUser = z.infer<typeof getChatUser>;

export type ChatUser = TGetChatUser['data']['user'];

export type Message = z.infer<typeof getChatMessagesSchema>[number];

type MatchContactState = {
  queryState: 'idle' | 'fetching';
  data: MatchContact[];
  error: string | null;
};

type ConversationState = {
  queryState: 'idle' | 'fetching';
  error: string | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  chatUser: ChatUser | null;
  messages: Message[];
  loadMoreMessages: (
    page: number,
    abortController?: AbortController
  ) => Promise<void>;
};

export interface ChatContextType {
  matchContactState: MatchContactState;
  conversationState: ConversationState;
  onlineUsers: Set<string>;
  sendMessage: {
    isSending: boolean;
    fn: (
      matchId: string,
      content: string,
      receiverId: string
    ) => Promise<boolean>;
  };
}

const PAGE_SIZE = 20;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { matchId } = useParams();

  const {
    data: matchContacts,
    setData: setMatchContacts,
    isLoading: isFetchingMatchContacts,
    error: matchContactsError,
  } = useAxiosGet<TGetMatchContact>({
    url: '/chat/match-contacts',
    initialData: null,
    validationSchema: getMatchContactsSchema,
  });

  const { data: chatUser, isLoading: isFetchingChatUser } =
    useAxiosGet<TGetChatUser>({
      url: `/chat/${matchId}/user`,
      initialData: null,
      validationSchema: getChatUser,
      enabled: !!matchId,

      onSuccess: useCallback(() => {
        setMatchContacts((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            data: {
              matchContacts: prev.data.matchContacts.map((contact) => {
                if (contact.matchId === matchId) {
                  return {
                    ...contact,
                    unreadMsgCount: 0,
                  };
                }
                return contact;
              }),
            },
          };
        });
      }, [setMatchContacts, matchId]),
    });

  const {
    data: messages,
    setData: setMessages,
    page: messagesPage,
    setPage: setMessagesPage,
    hasMore: hasMoreMessages,
    fetchFn: loadMoreMessages,
    isLoading: isFetchingMessages,
  } = usePaginatedAxiosGet<Message>({
    url: `/chat/${matchId}/messages`,
    validationSchema: getChatMessagesSchema,
    initialData: [],
    pageSize: PAGE_SIZE,
    enabled: !!matchId,
  });

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const onlineUsers = useOnlineUsers();

  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const { socket } = useSocket();

  const sendMessage = async (
    matchId: string,
    content: string,
    receiverId: string
  ) => {
    if (!content.trim()) return false;
    setIsSendingMessage(true);
    try {
      const response = await axiosPrivate.post(`/chat/${matchId}/messages`, {
        matchId: matchId,
        message: content,
        receiverId: receiverId,
      });

      setIsSendingMessage(false);
      setMessages((prev) => [...prev, response.data.data.chatMessage]);

      return true;
    } catch (error) {
      console.log(error);
      setIsSendingMessage(false);
      return false;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (data) => {
      if (data.matchId === params.matchId) {
        setMessages((prev) => [...prev, data.message]);

        socket.emit('mark-as-read', {
          messageId: data.message.id,
        });
      } else {
        const senderName = data.senderName;

        setMatchContacts((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            data: {
              matchContacts: prev.data.matchContacts.map((contact) => {
                if (contact.matchId === data.matchId) {
                  return {
                    ...contact,
                    unreadMsgCount: contact.unreadMsgCount + 1,
                  };
                }

                return contact;
              }),
            },
          };
        });

        toast.info(`New message from ${senderName}`, {
          description: data.message.text,
          icon: '💬',
          duration: 5000,
        });
      }
    });
    return () => {
      socket.off('new-message');
    };
  }, [socket, params.matchId, setMessages, setMatchContacts]);

  return (
    <ChatContext.Provider
      value={{
        matchContactState: {
          data: matchContacts?.data ? matchContacts.data.matchContacts : [],
          queryState: isFetchingMatchContacts ? 'fetching' : 'idle',
          error: matchContactsError,
        },
        conversationState: {
          queryState:
            isFetchingChatUser || isFetchingMessages ? 'fetching' : 'idle',
          error: '',
          page: messagesPage,
          setPage: setMessagesPage,
          hasMore: hasMoreMessages,
          chatUser: chatUser?.data ? chatUser.data.user : null,
          messages: messages,
          loadMoreMessages: loadMoreMessages,
        },
        onlineUsers,
        sendMessage: {
          isSending: isSendingMessage,
          fn: sendMessage,
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error('useChatContext must be used within a ChatProvider');
  return context;
}

// THIS IS USED TO FETCH ONLINE USERS IDS
function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const axiosPrivate = useAxiosPrivate();

  const POLLING_INTERVAL = 60 * 1000; // 1 minute

  const fetchOnlineUsers = useCallback(async () => {
    try {
      const response = await axiosPrivate.get('/chat/online-users', {
        fetchOptions: {
          cache: 'no-cache',
        },
      });
      setOnlineUsers(new Set(response.data.data.onlineUsers));
    } catch (error) {
      const { errorMessage } = handleAxiosError(
        error,
        'Error fetching online users'
      );

      console.log('Error fetching online users: ', errorMessage);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchOnlineUsers();

    const interval = setInterval(() => {
      fetchOnlineUsers();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchOnlineUsers, POLLING_INTERVAL]);

  return onlineUsers;
}

// THIS IS USED TO FETCH MESSAGES.
function usePaginatedAxiosGet<T>({
  url,
  validationSchema,
  initialData,
  pageSize,
  enabled,
}: {
  url: string;
  validationSchema: z.ZodSchema;
  initialData: T[];
  pageSize: number;
  enabled: boolean;
}) {
  const axiosInstance = useAxiosPrivate();

  const [data, setData] = React.useState<T[]>(initialData);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  // Function to reset state when URL changes
  React.useEffect(() => {
    setData([]);
    setError(null);
    setPage(1);
    setHasMore(false);
  }, [url]);

  const fetchData = React.useCallback(
    async (currentPage: number, abortController?: AbortController) => {
      setIsLoading(true);
      setError(null);

      axiosInstance
        .get<{ message: string; data: T[] }>(url, {
          params: { page: currentPage, pageSize },
          signal: abortController?.signal,
        })
        .then(({ data }) => {
          const validatedData = validationSchema.safeParse(data.data);
          if (validatedData.success) {
            setData((prev) =>
              currentPage === 1
                ? validatedData.data.reverse()
                : [...validatedData.data.reverse(), ...prev]
            );
            setHasMore(validatedData.data.length === pageSize);
            if (validatedData.data.length === pageSize) {
              setPage(currentPage + 1);
            }
          } else {
            console.log(validatedData.error);
            setError("Data didn't match schema");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          const { errorMessage } = handleAxiosError(
            error,
            `Failed to get ${url} with page ${currentPage}`
          );
          setError(errorMessage);
        })
        .finally(() => setIsLoading(false));
    },
    [url, validationSchema, axiosInstance, pageSize]
  );

  React.useEffect(() => {
    if (!enabled) return;
    const abortController = new AbortController();
    fetchData(1, abortController);
    return () => abortController.abort();
  }, [fetchData, enabled]);

  return {
    data,
    setData,
    isLoading,
    error,
    fetchFn: fetchData,
    page,
    setPage,
    hasMore,
    setHasMore,
  };
}
