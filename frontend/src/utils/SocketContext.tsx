"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | undefined;
}

const SocketContext = createContext<ISocketContext>({ socket: undefined });

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketInstance = io("http://localhost:5001", {
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    // Disconnect socket when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
