"use client";

import { warnToast } from "@/components/atoms/Toast";
import { createContext, useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";
import throttle from "lodash/throttle";

export const SocketContext = createContext({
  socket: null,
});

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const { user, logout } = useAuth();

  const logoutDuplicateUser = useCallback(() => {
    warnToast("Another user has logged in with these credentials");
    setTimeout(() => {
      logout();
      socket.disconnect();
    }, 3000);
  }, [socket, logout]);

  const throttleLogoutDuplicateUser = throttle(() => {
    logoutDuplicateUser();
  }, 3000);

  useEffect(() => {
    // socket.connect();
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

    socket.on("connect", onConnect);
    socket.on("duplicate-session-started", throttleLogoutDuplicateUser);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("duplicate-session-started", throttleLogoutDuplicateUser);
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
