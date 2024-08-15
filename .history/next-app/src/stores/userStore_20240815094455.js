import { createStore } from "zustand";

import { apiInstance } from "@/lib/api";
import { errorToast } from "@/atoms/Toast";

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
        const { data } = await apiInstance.post(
          "/api/auth/login",
          credentials,
          {
            withCredentials: true,
          }
        );
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
        set({ ...initialState });
      } catch {
        set((state) => ({
          ...state,
          loading: false,
        }));
      }
    },
  }));
};

export default createUserStore;
