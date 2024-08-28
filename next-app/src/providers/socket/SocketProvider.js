"use client";

import { warnToast } from "@/components/atoms/Toast";
import { createContext, useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const SocketContext = createContext({
  socket: null,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  const connect = useCallback(() => {
    if (!socket) {
      const socketIo = io(URL, {
        withCredentials: true,
        cors: {
          origin: "*",
        },
      });

      setSocket(socketIo);

      socketIo.on("connect", () => {
        setIsConnected(true);
      });

      socketIo.on("disconnect", () => {
        setIsConnected(false);
      });
    }
  }, [socket, user]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const emit = useCallback(
    (event, data) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const on = useCallback(
    (event, callback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const off = useCallback(
    (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        emit,
        on,
        off,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
