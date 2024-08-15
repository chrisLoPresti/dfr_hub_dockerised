import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  isAPILoading: false,
  selectedMapMarker: null,
  defaultMarkerColor: "blue",
  canDragMarkers: false,
  canCreateMapMarkers: false,
};

export const useMapMarkerStore = create(
  persist(
    (set) => ({
      ...initialState,
      toggleAPILoading: () =>
        set((state) => ({ ...state, isAPILoading: !state.isAPILoading })),
      toggleCanDragMarkers: () =>
        set((state) => ({ ...state, canDragMarkers: !state.canDragMarkers })),
      toggleCanCreateMapMarkers: () =>
        set((state) => ({
          ...state,
          canCreateMapMarkers: !state.canCreateMapMarkers,
        })),
      setDefaultMarkerColor: (color) =>
        set((state) => ({ ...state, defaultMarkerColor: color })),
      setSelectedMapMarker: (marker) =>
        set((state) => ({ ...state, selectedMapMarker: marker })),
    }),
    {
      name: "defaultMarkerColor",
      partialize: (state) => ({ defaultMarkerColor: state.defaultMarkerColor }),
    }
  )
);
