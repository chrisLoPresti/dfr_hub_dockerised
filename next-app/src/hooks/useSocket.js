"use client";

import { useContext } from "react";
import { SocketContext } from "@/providers/socket/SocketProvider";

export const useSocket = () => {
  const { socket, isConnected } = useContext(SocketContext);

  return { socket, isConnected };
};
