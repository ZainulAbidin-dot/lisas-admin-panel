import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { useSocket } from '@/context/socket-context';
import { handleAxiosError } from '@/lib/handle-api-error';

export type MatchContact = {
  userId: string;
  userName: string;
  profileImage: string;
  matchId: string;
  unreadMsgCount: number;
};

type MatchContactState = {
  queryState: 'idle' | 'fetching';
  data: MatchContact[];
  error: string | null;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO timestamp
};

type ConversationState = {
  queryState: 'idle' | 'fetching' | 'sending-message' | 'loading-more-messages';
  error: string | null;
  page: number;
  hasMore: boolean;
  chatUser: MatchContact | null;
  messages: Message[];
};

export interface ChatContextType {
  matchContactState: MatchContactState;
  conversationState: ConversationState;
  onlineUsers: Set<string>;
  sendMessage: (
    matchId: string,
    content: string,
    receiverId: string
  ) => Promise<boolean>;
  loadMoreMessages: (abortSignal?: AbortSignal) => Promise<void>;
}

const PAGE_SIZE = 10;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [matchContactState, setMatchContactState] = useState<MatchContactState>(
    {
      queryState: 'fetching',
      data: [],
      error: null,
    }
  );

  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      queryState: 'fetching',
      page: 1,
      hasMore: false,
      error: null,
      chatUser: null,
      messages: [],
    }
  );

  const location = useLocation();

  const isChatPage = location.pathname.startsWith('/chat');

  const onlineUsers = useOnlineUsers({ enable: isChatPage });

  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const { socket } = useSocket();

  const fetchMatchContacts = useCallback(
    async (abortSignal?: AbortSignal) => {
      setMatchContactState({ queryState: 'fetching', data: [], error: null });
      try {
        const response = await axiosPrivate.get('/chat/match-contacts', {
          signal: abortSignal,
        });
        setMatchContactState({
          queryState: 'idle',
          data: response.data.data.matchContacts,
          error: null,
        });
      } catch (error) {
        const { errorMessage } = handleAxiosError(
          error,
          'Error fetching contacts'
        );
        setMatchContactState({
          queryState: 'idle',
          data: [],
          error: errorMessage,
        });
      }
    },
    [axiosPrivate]
  );

  const fetchConversation = useCallback(
    async (abortSignal?: AbortSignal) => {
      if (!params.matchId) return;
      setConversationState((prev) => ({
        ...prev,
        queryState: 'fetching',
        error: null,
      }));
      try {
        const response = await axiosPrivate.get(
          `/chat/conversations/${params.matchId}`,
          { signal: abortSignal }
        );

        setConversationState({
          queryState: 'idle',
          page: 1,
          hasMore: response.data.data.chatMessages.length >= PAGE_SIZE,
          error: null,
          chatUser: response.data.data.chatUser,
          messages: response.data.data.chatMessages,
        });

        setMatchContactState((prev) => ({
          ...prev,
          data: prev.data.map((contact) => {
            if (contact.matchId === params.matchId) {
              return {
                ...contact,
                unreadMsgCount: 0,
              };
            }
            return contact;
          }),
        }));
      } catch (error) {
        const { errorMessage } = handleAxiosError(
          error,
          'Error fetching conversation'
        );
        setConversationState((prev) => ({
          ...prev,
          queryState: 'idle',
          error: errorMessage,
        }));
      }
    },
    [axiosPrivate, params.matchId]
  );

  const loadMoreMessages = useCallback(async () => {
    if (
      !params.matchId ||
      conversationState.queryState !== 'idle' ||
      !conversationState.hasMore
    )
      return;
    setConversationState((prev) => ({
      ...prev,
      queryState: 'loading-more-messages',
    }));
    try {
      const response = await axiosPrivate.get(
        `/chat/conversations/${params.matchId}?page=${conversationState.page + 1}`
      );
      setConversationState((prev) => ({
        ...prev,
        queryState: 'idle',
        page: prev.page + 1,
        hasMore: response.data.data.chatMessages.length >= PAGE_SIZE,
        messages: [...prev.messages, ...response.data.data.chatMessages],
      }));
    } catch (error) {
      const { errorMessage } = handleAxiosError(
        error,
        'Error loading more messages'
      );
      setConversationState((prev) => ({
        ...prev,
        queryState: 'idle',
        error: errorMessage,
      }));
    }
  }, [axiosPrivate, params.matchId, conversationState]);

  const sendMessage = useCallback(
    async (matchId: string, content: string, receiverId: string) => {
      if (!content.trim()) return false;
      setConversationState((prev) => ({
        ...prev,
        queryState: 'sending-message',
      }));
      try {
        const response = await axiosPrivate.post(
          `/chat/conversations/messages`,
          { message: content, matchId, receiverId }
        );
        setConversationState((prev) => ({
          ...prev,
          queryState: 'idle',
          messages: [response.data.data.chatMessage, ...prev.messages],
        }));
        return true;
      } catch (error) {
        const { errorMessage } = handleAxiosError(
          error,
          'Error sending message'
        );
        setConversationState((prev) => ({
          ...prev,
          queryState: 'idle',
          error: errorMessage,
        }));
        return false;
      }
    },
    [axiosPrivate]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchMatchContacts(abortController.signal);
    return () => abortController.abort();
  }, [fetchMatchContacts]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchConversation(abortController.signal);
    return () => abortController.abort();
  }, [fetchConversation]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (data) => {
      if (data.matchId === params.matchId) {
        setConversationState((prev) => ({
          ...prev,
          messages: [data.message, ...prev.messages],
        }));

        socket.emit('mark-as-read', {
          messageId: data.message.id,
        });
      } else {
        const senderName = data.senderName;

        setMatchContactState((prev) => {
          return {
            ...prev,
            data: prev.data.map((contact) => {
              if (contact.matchId === data.matchId) {
                return {
                  ...contact,
                  unreadMsgCount: contact.unreadMsgCount + 1,
                };
              }
              return contact;
            }),
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
  }, [socket, params.matchId]);

  return (
    <ChatContext.Provider
      value={{
        matchContactState,
        conversationState,
        onlineUsers,
        sendMessage,
        loadMoreMessages,
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

function useOnlineUsers({ enable }: { enable: boolean }) {
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
    if (!enable) return;

    fetchOnlineUsers();

    const interval = setInterval(() => {
      fetchOnlineUsers();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchOnlineUsers, enable, POLLING_INTERVAL]);

  return onlineUsers;
}
