import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  map: null,
  elevator: null,
  center: null,
  mapTypeId: "hybrid",
};

export const useMapStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setMap: (map) => set((state) => ({ ...state, map })),
      setElevator: (elevator) => set((state) => ({ ...state, elevator })),
      centerMap: (position) => {
        if (!position) {
          return;
        }
        set((state) => {
          if (state.map) {
            if (state.map.getZoom() < 15) {
              state.map.setZoom(15);
            }
            if (
              position.lat === state.center.lat &&
              position.lng === state.center.lng &&
              position.elevation === state.center.elevation
            ) {
              state.map.setCenter(position);
            }
          }
          return {
            ...state,
            center: position,
          };
        });
      },
      setMapTypeId: () => {
        const map = get().map;
        if (!map) {
          return;
        }
        const oldMapTypeId = get().mapTypeId;
        const newMapTypeId = get().map.getMapTypeId();
        if (newMapTypeId !== oldMapTypeId) {
          set((state) => {
            return { ...state, mapTypeId: newMapTypeId };
          });
        }
      },
    }),
    {
      name: "mapTypeId",
      partialize: (state) => ({ mapTypeId: state.mapTypeId }),
    }
  )
);
