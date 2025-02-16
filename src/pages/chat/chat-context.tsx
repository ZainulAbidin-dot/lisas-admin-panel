import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useParams } from 'react-router-dom';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';

export type ChatUser = {
  matchId: string;
  userId: string;
  userName: string;
  profileImage?: string;
};

type ChatMessage = {
  text: string;
  createdAt: Date;
  isOwnMessage: boolean;
};

export type Conversation = {
  chatUser: ChatUser;
  messages: ChatMessage[];
};

type ChatContextType = {
  contactsState: {
    queryState: 'idle' | 'fetching' | 'refetching';
    data: ChatUser[];
  };

  conversationState: {
    queryState: 'idle' | 'fetching' | 'refetching' | 'sending-message';
    firstFetch: boolean;
    data: Conversation;
  };

  fetchConversationByMatchId: (
    matchId: string,
    abortSignal?: AbortSignal
  ) => Promise<void>;

  sendMessage: (message: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType>({
  contactsState: {
    queryState: 'idle',
    data: [],
  },

  conversationState: {
    queryState: 'idle',
    firstFetch: true,
    data: {
      chatUser: {
        matchId: '',
        userId: '',
        userName: '',
      },
      messages: [],
    },
  },

  fetchConversationByMatchId: async () => {},

  sendMessage: async () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [contactsState, setContactsState] = useState<{
    queryState: 'idle' | 'fetching' | 'refetching';
    data: ChatUser[];
  }>({
    queryState: 'idle',
    data: [],
  });

  const [conversationState, setConversationState] = useState<{
    queryState: 'idle' | 'fetching' | 'refetching' | 'sending-message';
    firstFetch: boolean;
    data: Conversation;
  }>({
    queryState: 'idle',
    firstFetch: true,
    data: {
      chatUser: {
        matchId: '',
        userId: '',
        userName: '',
      },
      messages: [],
    },
  });

  const axiosPrivate = useAxiosPrivate();

  const { token } = useAuthStore();

  const { matchId } = useParams();

  const currentUserId = token?.decoded?.userId;

  const fetchContacts = useCallback(
    async (abortSignal?: AbortSignal) => {
      try {
        setContactsState((prev) => ({
          ...prev,
          queryState: 'fetching',
        }));
        const response = await axiosPrivate.get('chat/conversations', {
          signal: abortSignal,
        });

        setContactsState({
          queryState: 'idle',
          data: response.data.data.conversations,
        });
      } catch (error) {
        console.log('Error fetching contacts', error);
      }
    },
    [axiosPrivate]
  );

  const fetchConversationByMatchId = useCallback(
    async (matchId: string, abortSignal?: AbortSignal) => {
      try {
        setConversationState((prev) => ({
          ...prev,
          queryState: prev.firstFetch ? 'fetching' : 'refetching',
        }));
        const response = await axiosPrivate.get(
          `/chat/conversations/${matchId}`,
          {
            signal: abortSignal,
          }
        );

        console.log(response.data);

        setConversationState({
          queryState: 'idle',
          firstFetch: false,
          data: {
            chatUser: response.data.data.chatUser,
            messages: response.data.data.chatMessages.map(
              (m: { text: string; createdAt: string; senderId: string }) => ({
                text: m.text,
                createdAt: new Date(m.createdAt),
                isOwnMessage: m.senderId === currentUserId,
              })
            ),
          },
        });
      } catch (error) {
        console.log('Error fetching conversation', error);
        setConversationState((prev) => ({
          ...prev,
          firstFetch: false,
          queryState: 'idle',
        }));
      }
    },
    [axiosPrivate, currentUserId]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        setConversationState((prev) => ({
          ...prev,
          queryState: 'sending-message',
        }));

        await axiosPrivate.post(`/chat/conversations/messages`, {
          message,
          matchId: conversationState.data.chatUser.matchId,
          receiverId: conversationState.data.chatUser.userId,
        });

        const newChatMessage: ChatMessage = {
          text: message,
          createdAt: new Date(),
          isOwnMessage: true,
        };

        setConversationState((prev) => ({
          ...prev,
          queryState: 'idle',
          data: {
            ...prev.data,
            messages: [...prev.data.messages, newChatMessage],
          },
        }));
      } catch (error) {
        console.log('Error sending message', error);
        setConversationState((prev) => ({
          ...prev,
          queryState: 'idle',
        }));
      }
    },
    [axiosPrivate, conversationState]
  );

  useEffect(() => {
    const abortController = new AbortController();

    fetchContacts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchContacts]);

  const POLL_INTERVAL = 5000; // Adjust polling interval as needed (e.g., 5 seconds)

  useEffect(() => {
    if (!matchId) return;

    let abortController = new AbortController();

    const fetchConversation = () => {
      abortController.abort(); // Cancel any ongoing request before starting a new one
      abortController = new AbortController(); // Create a new AbortController instance
      fetchConversationByMatchId(matchId, abortController.signal);
    };

    fetchConversation(); // Initial fetch
    const interval = setInterval(fetchConversation, POLL_INTERVAL);

    return () => {
      clearInterval(interval); // Cleanup interval on unmount
      abortController.abort(); // Abort ongoing request
    };
  }, [matchId, fetchConversationByMatchId]);

  // useEffect(() => {
  //   const abortController = new AbortController();

  //   if (matchId) {
  //     fetchConversationByMatchId(matchId, abortController.signal);
  //   }

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [matchId, fetchConversationByMatchId]);

  return (
    <ChatContext.Provider
      value={{
        contactsState,
        conversationState,
        fetchConversationByMatchId,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
