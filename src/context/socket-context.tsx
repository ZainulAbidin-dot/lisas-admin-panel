import { createContext, useContext, useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';

// Define your socket context type
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const encodedToken = useAuthStore((state) => state.token?.encoded);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL!, {
      auth: {
        token: encodedToken,
      },
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect(); // Clean up the socket when the component unmounts
    };
  }, [encodedToken]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <Outlet />
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
}
