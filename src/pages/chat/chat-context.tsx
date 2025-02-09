//! This context is currently set to test the chat feature
import { createContext, useContext, useState } from 'react';

type ChatUser = {
  id: string;
  name: string;
  profileImage: string;
  isOnline: boolean;
  unreadMessages: number;
};

export type Contact = {
  user: ChatUser;
  lastMessage: {
    text: string;
    createdAt: Date;
  } | null;
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
  contacts: Contact[];

  conversations: Record<string, Conversation>;
  getCoversationByUserId: (id: string) => Conversation;

  addMessage: (userId: string, message: ChatMessage) => void;
};

const ChatContext = createContext<ChatContextType>({
  contacts: [],
  conversations: {},
  getCoversationByUserId: () => ({}) as Conversation,
  addMessage: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const stringData = localStorage.getItem('contacts');
      if (!stringData) {
        throw new Error('No contacts found in local storage');
      }

      const data = JSON.parse(stringData);

      return data as Contact[];
    } catch (error) {
      console.log('Error parsing contacts', error);
      const contacts = Array.from({ length: 20 }).map((_, i) => {
        const unreadMessages = Math.floor(Math.random() * 5);
        const isOnline = Math.random() > 0.5;
        return {
          user: {
            id: `user-${i}`,
            name: `User ${i + 1}`,
            profileImage: 'https://picsum.photos/id/100/200/300',
            isOnline: isOnline,
            unreadMessages: unreadMessages,
          },
          lastMessage: null,
        };
      });

      localStorage.setItem('contacts', JSON.stringify(contacts));

      return contacts;
    }
  });

  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >(() => {
    try {
      const stringData = localStorage.getItem('conversations');

      if (!stringData) {
        throw new Error('No conversations found in local storage');
      }

      const data = JSON.parse(stringData, (key, value) => {
        if (key === 'createdAt') {
          return new Date(value);
        }
        return value;
      });

      return data;
    } catch (error) {
      console.log('Error parsing conversations', error);

      const newConversations: Record<string, Conversation> = {};

      contacts.forEach((contact) => {
        newConversations[contact.user.id] = {
          chatUser: contact.user,
          messages: [],
        };
      });

      localStorage.setItem('conversations', JSON.stringify(newConversations));

      return newConversations;
    }
  });

  const getCoversationByUserId = (id: string) => {
    const conversation = conversations[id];

    return conversation;
  };

  const addMessage = (userId: string, message: ChatMessage) => {
    const conversation = getCoversationByUserId(userId);

    conversation.messages.push(message);

    setConversations({
      ...conversations,
      [userId]: conversation,
    });

    setContacts(
      contacts.map((c) => {
        if (c.user.id === userId) c.lastMessage = message;
        return c;
      })
    );

    localStorage.setItem('contacts', JSON.stringify(contacts));
    localStorage.setItem('conversations', JSON.stringify(conversations));
  };

  return (
    <ChatContext.Provider
      value={{
        contacts,
        conversations,
        getCoversationByUserId,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
