"use client";

import { useEffect, useCallback, useState } from "react";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FaSpinner } from "react-icons/fa6";
import MapMarker from "./MapMarker";
import CreatePinPointButton from "./CreatePinPointButton";
import LockMarkersButton from "./LockMarkersButton";
import SelectedMarkerDrawer from "./SelectedMarkerDrawer";
import { useGeolocated } from "react-geolocated";
import { useMapStore } from "@/stores/mapStore";
import useMapMarkers from "@/hooks/useMapMarkers";
import Image from "next/image";
import { useDeviceContext } from "@/providers/devices/DevicesProvider";
import SelectedDevice from "./SelectedDevice";
import DroneMarker from "./DroneMarker";
import { useSocket } from "@/hooks/useSocket";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

export const Map = () => {
  const {
    setMap,
    setElevator,
    setMapTypeId,
    mapTypeId,
    centerMap,
    center,
    elevator,
  } = useMapStore();

  const {
    createNewMapMarker,
    selectMapMarker,
    markers,
    isLoading,
    canCreateMapMarkers,
  } = useMapMarkers();

  const [searchBox, setSearchBox] = useState(null);
  const { selectedDevice } = useDeviceContext();
  const { connect, on, off } = useSocket();
  const [realTimeDroneData, setRealTimeDroneData] = useState({});

  const onMapLoad = (map) => {
    setMap(map);
    const newElevator = new google.maps.ElevationService();
    setElevator(newElevator);
  };

  const onSearchBoxLoad = (newSearchBox) => {
    setSearchBox(newSearchBox);
  };

  const onUnmount = () => {
    setMap(null);
    setElevator(null);
  };

  const onAddressFound = useCallback(() => {
    const address = searchBox.getPlaces();
    const latLng = address[0].geometry.location;
    createNewMapMarker({
      name: address[0].name,
      position: {
        lat: latLng.lat(),
        lng: latLng.lng(),
      },
      // workspace_id: "030a6a94-3c84-11ef-8ace-570f0d051196",
      selectedDevice,
    });
  }, [searchBox, createNewMapMarker, selectedDevice]);

  const dropMarker = useCallback(
    async ({ latLng, name }) => {
      if (canCreateMapMarkers && !isLoading) {
        const marker = {
          name: name || `new pin ${new Date().toLocaleString()}`, // `new pin ${uuidv4()}`,
          position: {
            lat: latLng.lat(),
            lng: latLng.lng(),
          },
          // workspace_id: "030a6a94-3c84-11ef-8ace-570f0d051196",
          selectedDevice: selectedDevice,
        };

        const newMarker = await createNewMapMarker(marker);
        if (newMarker) {
          selectMapMarker(newMarker);
        }
      }
    },
    [
      createNewMapMarker,
      canCreateMapMarkers,
      isLoading,
      elevator,
      selectedDevice,
    ]
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
    libraries,
  });

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity,
    },
    watchPosition: false,
    userDecisionTimeout: null,
    suppressLocationOnMount: false,
    // geolocationProvider: navigator.geolocation,
    isOptimisticGeolocationEnabled: true,
    watchLocationPermissionChange: false,
  });

  useEffect(() => {
    centerMap({
      lat: coords?.latitude,
      lng: coords?.longitude,
    });
  }, [coords, centerMap]);

  const messageHandler = (message) => {
    setRealTimeDroneData(JSON.parse(message));
  };

  useEffect(() => {
    connect();
    on("real-time-update", messageHandler);
    return () => {
      off("real-time-update", messageHandler);
    };
  }, [on, off]);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={dropMarker}
        onMapTypeIdChanged={setMapTypeId}
        options={{
          fullscreenControl: false,
          mapTypeId: mapTypeId,
          rotateControl: true,
          streetViewControl: false,
          minZoom: 5,
          draggableCursor: canCreateMapMarkers ? "crosshair" : "",
        }}
      >
        <>
          {selectedDevice && <DroneMarker droneData={realTimeDroneData} />}
          {markers?.map((marker) => (
            <MapMarker key={marker._id} marker={marker} />
          ))}
          <CreatePinPointButton />
        </>
        <LockMarkersButton />
        <StandaloneSearchBox
          onPlacesChanged={onAddressFound}
          onLoad={onSearchBoxLoad}
        >
          <input
            type="text"
            placeholder="Search for an address"
            className="overflow-ellipses outline-none w-96 h-27 absolute top-2.5 p-2 rounded-sm shadow-lg right-2 z-20"
          />
        </StandaloneSearchBox>
        <>
          <SelectedDevice realTimeDroneData={realTimeDroneData} />
        </>
      </GoogleMap>
      <SelectedMarkerDrawer />
    </>
  ) : (
    <div className="relative text-white flex w-full h-full items-center justify-center gap-3 bg-cover bg-center h-screen text-white text-2xl">
      <Image
        src={"/map_placeholder.jpg"}
        alt="Map loading background image"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority={true}
      />
      <div className="absolute top-50 left-50 flex flex-col items-center justify-center gap-y-2">
        <p>Loading map...</p>
        <FaSpinner className="animate-spin h-5 w-5" />
      </div>
    </div>
  );
};
