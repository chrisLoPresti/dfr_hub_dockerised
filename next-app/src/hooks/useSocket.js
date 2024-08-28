"use client";

import { useContext } from "react";
import { SocketContext } from "@/providers/socket/SocketProvider";

export const useSocket = () => {
  const { connect, disconnect, emit, on, off, isConnected } =
    useContext(SocketContext);

  return { emit, on, off, isConnected, connect, disconnect };
};
