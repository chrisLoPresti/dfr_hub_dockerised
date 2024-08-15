import { AuthContext } from "@/providers/auth/AuthProvider";
import { useContext } from "react";
import { useStore } from "zustand";

export const useAuth = (selector) => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error("Missing AuthContext/Provider in the tree");
  }

  return useStore(store, selector);
};
