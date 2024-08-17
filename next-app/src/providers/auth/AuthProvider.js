"use client";

import createUserStore from "@/stores/userStore";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useRef } from "react";

export const AuthContext = createContext(null);

const ingorePaths = ["/login", "/logout", "/_next"];

export const AuthProvider = ({ children, session }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = createUserStore({ user: session?.user });
  }

  if (!session?.user && session?.sessionCookie) {
    storeRef.current.getState().logout();
  }

  const isProtectedRoute = () => {
    if (pathname === "/") {
      return false;
    }
    return !ingorePaths.some((path) => pathname.includes(path));
  };

  // useEffect(() => {
  if (isProtectedRoute() && !storeRef.current.getState().user) {
    let searches = "";

    try {
      searches =
        searchParams?.keys()?.reduce((accu, key) => {
          const value = searchParams.get(key);
          return (accu += `${key}=${value}&`);
        }, "?") ?? "";
    } catch (e) {
      searches = "";
    }

    redirect(`/login?redirect=${encodeURI(`${pathname}${searches}`)}`);
  }

  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
};
