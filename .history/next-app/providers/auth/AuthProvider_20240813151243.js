"use client";

import createUserStore from "@/stores/userStore";
import { createContext, useRef } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children, session }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createUserStore({ user: session.user });
  }

  if (!session.user && session.sessionCookie) {
    storeRef.current.getState().logout();
  }

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
};
