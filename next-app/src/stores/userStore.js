import { createStore } from "zustand";

import { apiInstance } from "@/lib/api";
import { errorToast } from "@/components/atoms/Toast";

const createUserStore = (initialState) => {
  const defaultState = {
    user: null,
    loading: false,
    error: null,
  };

  return createStore((set) => ({
    ...defaultState,
    ...initialState,
    login: async (credentials) => {
      set((state) => ({ ...state, loading: true }));
      try {
        const { data } = await apiInstance.post("/api/auth/login", credentials);
        set((state) => ({
          ...state,
          user: data,
          loading: false,
          error: null,
        }));
      } catch (error) {
        errorToast("Invalid login credentials");
        set((state) => ({
          ...state,
          loading: false,
          error: "Invalid login credentials",
        }));
      }
    },
    logout: async () => {
      set((state) => ({ ...state, loading: true }));
      try {
        await apiInstance.post("/api/auth/logout");
        set({ ...initialState, loading: false });
        window.location.href = "/login";
      } catch {
        set((state) => ({
          ...state,
          loading: false,
        }));
      }
    },
    setUser: (user) => set((state) => ({ ...state, user })),
  }));
};

export default createUserStore;
