"use client";

import { warnToast } from "@/components/atoms/Toast";
import { createContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";

export const SocketContext = createContext({
  socket: null,
});

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const { user, logout } = useAuth();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      socket.emit("user-connected", { user: user._id });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function duplicateUser() {
      warnToast("Another user has logged in with these credentials");
      logout();
      socket.disconnect();
    }

    socket.on("connect", onConnect);
    socket.on("new-session-started", duplicateUser);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new-session-started", duplicateUser);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
