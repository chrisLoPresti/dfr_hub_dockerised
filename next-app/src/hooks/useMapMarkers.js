import themeConfig from "@/../tailwind.config";
import useSWR from "swr";
import { errorToast, successToast } from "@/components/atoms/Toast";
import { useMapStore } from "@/stores/mapStore";
import { apiInstance } from "@/lib/api";
import { useCallback, useEffect } from "react";
import { useMapMarkerStore } from "@/stores/mapMarkerStore";
import { useSocket } from "./useSocket";

const useMapMarkers = () => {
  const fetcher = async (url) => {
    const { data } = await apiInstance.get(url);
    return data;
  };

  const markerColors = {
    blue: themeConfig.theme.extend.colors["blue-annotation"],
    yellow: themeConfig.theme.extend.colors["yellow-annotation"],
    purple: themeConfig.theme.extend.colors["purple-annotation"],
    green: themeConfig.theme.extend.colors["green-annotation"],
    red: themeConfig.theme.extend.colors["red-annotation"],
  };

  const { centerMap, elevator } = useMapStore();
  const {
    isAPILoading,
    selectedMapMarker,
    defaultMarkerColor,
    canDragMarkers,
    canCreateMapMarkers,
    toggleAPILoading,
    toggleCanDragMarkers,
    toggleCanCreateMapMarkers,
    setDefaultMarkerColor,
    setSelectedMapMarker,
  } = useMapMarkerStore();

  const {
    data: markers = [],
    isLoading,
    mutate,
  } = useSWR("/api/markers/getmarkers", (url) => fetcher(url));

  const { socket } = useSocket();

  const createNewMapMarker = useCallback(
    async ({ selectedDevice, ...marker }) => {
      try {
        toggleAPILoading();

        const { results } = await elevator.getElevationForLocations({
          locations: [marker.position],
        });

        const elevation = results[0].elevation;
        marker.position.elevation = elevation;
        // const res = await axios.post(
        //   "https://nj.unmannedlive.com/dfr/newcall",
        //   {
        //     ...marker,
        //     lat: marker.position.lat,
        //     lon: marker.position.lng,
        //     z:  marker.position.elevation,
        //     workspaceid: selectedDevice.workspace_id,
        //     sn: selectedDevice.serial_number,
        //   },
        //   {
        //     withCredentials: false,
        //   }
        // );
        // if (res.status === 201) {
        const { data: newMarker } = await apiInstance.post(
          `/api/markers/createmarker`,
          {
            ...marker,
            color: marker.color || defaultMarkerColor,
            socket: socket?.id,
          }
        );
        successToast(`Successfully created Map Marker: ${newMarker.name}!`);
        mutate([...markers, newMarker]);
        centerMap(newMarker.position);
        toggleAPILoading();
        return newMarker;
      } catch ({
        response: {
          data: { message },
        },
      }) {
        toggleAPILoading();
        errorToast(message);
        return null;
      }
    },
    [markers, elevator, defaultMarkerColor, socket]
  );

  const deleteMapMarker = useCallback(
    async (marker) => {
      try {
        toggleAPILoading();

        const { data } = await apiInstance.delete(`/api/markers/deletemarker`, {
          data: { ...marker, socket: socket?.id },
        });
        successToast(`Successfully deleted Map Marker: ${marker.name}`);
        mutate([...markers.filter(({ name }) => name !== marker.name)]);
        selectMapMarker(null);
        toggleAPILoading();
        return data;
      } catch ({
        response: {
          data: { message },
        },
      }) {
        errorToast(message);
        toggleAPILoading();
        return null;
      }
    },
    [markers, socket]
  );

  const updateMapMarker = useCallback(
    async (marker) => {
      try {
        toggleAPILoading();
        const { data: updatedMarker } = await apiInstance.put(
          `/api/markers/updatemarker`,
          { ...marker, socket: socket?.id }
        );
        successToast(`Successfully updated Map Marker: ${updatedMarker.name}`);

        const index = markers.findIndex(
          ({ name }) => name === updatedMarker.name
        );

        if (selectedMapMarker.name === updatedMarker.name) {
          selectMapMarker(updatedMarker);
        }

        markers[index] = updatedMarker;
        mutate([...markers]);
        centerMap(updatedMarker.position);
        toggleAPILoading();
        return updatedMarker;
      } catch ({
        response: {
          data: { message },
        },
      }) {
        errorToast(message);
        toggleAPILoading();
        return null;
      }
    },
    [markers, selectedMapMarker, socket]
  );

  const selectMapMarker = (marker) => {
    setSelectedMapMarker(marker);
    centerMap(marker?.position);
  };

  const updateSelectedMarker = useCallback(() => {
    const marker = markers.find(({ _id }) => selectedMapMarker._id === _id);
    selectMapMarker(marker);
  }, [selectMapMarker, markers]);

  useEffect(() => {
    if (selectedMapMarker) {
      updateSelectedMarker();
    }
  }, [markers, selectedMapMarker]);

  useEffect(() => {
    const updateMarkers = () => mutate();

    socket?.on("markers-updated", updateMarkers);
    return () => {
      socket?.off("markers-updated", updateMarkers);
    };
  }, []);

  return {
    isAPILoading,
    selectedMapMarker,
    defaultMarkerColor,
    canDragMarkers,
    canCreateMapMarkers,
    toggleAPILoading,
    toggleCanDragMarkers,
    toggleCanCreateMapMarkers,
    setDefaultMarkerColor,
    setSelectedMapMarker,
    markerColors,
    selectMapMarker,
    updateMapMarker,
    deleteMapMarker,
    createNewMapMarker,
    markers,
    isLoading: isAPILoading || isLoading,
  };
};

export default useMapMarkers;
