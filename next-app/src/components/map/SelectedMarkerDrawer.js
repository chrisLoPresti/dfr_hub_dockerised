"use client";

import classNames from "classnames";
import ColorButtons from "./ColorButtons";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineCenterFocusWeak, MdOutlineDelete } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import Input from "../atoms/Input";
import { FaSpinner } from "react-icons/fa";
import { IoLockOpenOutline, IoLockClosedOutline } from "react-icons/io5";

import { useMapStore } from "@/stores/mapStore";
import useMapMarkers from "@/hooks/useMapMarkers";

const SelectedMarkerDrawer = () => {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [elevation, setElevation] = useState(null);
  const [name, setName] = useState(null);

  const { centerMap } = useMapStore();
  const {
    selectMapMarker,
    selectedMapMarker,
    updateMapMarker,
    deleteMapMarker,
    isLoading,
  } = useMapMarkers();

  const handleDeselectMapMarker = () => {
    selectMapMarker(null);
  };

  const updateMapMarkerColor = useCallback(
    (color) => {
      updateMapMarker({ ...selectedMapMarker, color });
    },
    [selectedMapMarker]
  );

  const handleDeleteMarker = useCallback(() => {
    deleteMapMarker(selectedMapMarker);
  }, [selectedMapMarker, deleteMapMarker]);

  const onEnterPressed = useCallback(
    async ({ keyCode }) => {
      if (keyCode !== 13) {
        return;
      }

      if (selectedMapMarker) {
        const { lat, lng, elevation: ele } = selectedMapMarker.position;
        if (
          selectedMapMarker.name !== name ||
          lat !== +latitude ||
          lng !== +longitude ||
          ele !== +elevation
        ) {
          const updatedMarker = await updateMapMarker({
            ...selectedMapMarker,
            name,
            position: {
              lat: latitude,
              lng: longitude,
              elevation: elevation,
            },
          });

          if (!updatedMarker) {
            refreshState();
          }
        }
      }
    },
    [selectedMapMarker, latitude, longitude, elevation, name]
  );

  const toggleLockMapMarker = useCallback(() => {
    updateMapMarker({
      ...selectedMapMarker,
      locked: !selectedMapMarker.locked,
    });
  }, [selectedMapMarker, updateMapMarker]);

  const refreshState = useCallback(() => {
    setLatitude(selectedMapMarker?.position?.lat);
    setLongitude(selectedMapMarker?.position?.lng);
    setElevation(selectedMapMarker?.position?.elevation);
    setName(selectedMapMarker?.name);
  }, [selectedMapMarker]);

  const recenterMap = () => {
    centerMap(selectedMapMarker.position);
  };

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return (
    <div
      className={classNames("transition-all ease-in-out duration-500", {
        "w-0  opacity-0": !selectedMapMarker,
        "w-72 opacity-100": selectedMapMarker,
      })}
    >
      <div className="h-full p-5 w-72 bg-slate-700 flex flex-col gap-y-2 bg-slate-700">
        <div className="flex justify-center items-center">
          <label className="text-white" htmlFor="selected-marker-name">
            Selected Map Marker
          </label>
          <button
            onClick={handleDeselectMapMarker}
            className="text-white ml-auto"
            data-tooltip-id="tooltip"
            data-tooltip-content="Close Marker"
            disabled={isLoading || selectedMapMarker?.locked}
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-y-2 relative">
          {isLoading && (
            <div className="absolute flex items-center bg-slate-500 w-full h-full bg-opacity-70 rounded-sm">
              <FaSpinner className="animate-spin self-center text-white text-2xl mx-auto" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Input
              id="selected-marker-name"
              type="text"
              value={name || "marker name..."}
              className="w-full shadow-inner text-sm p-2 rounded-sm"
              disabled={isLoading || selectedMapMarker?.locked}
              onChange={setName}
              onKeyDown={onEnterPressed}
              data-tooltip-id="tooltip"
              data-tooltip-content={selectedMapMarker?.name}
            />
            <div className="flex items-center justify-center gap-x-2 ml-2">
              <button
                onClick={toggleLockMapMarker}
                className="text-white text-xl"
                data-tooltip-id="tooltip"
                data-tooltip-content={
                  selectedMapMarker?.locked
                    ? "Unlock map marker"
                    : "Lock map marker"
                }
                disabled={isLoading}
              >
                {selectedMapMarker?.locked ? (
                  <IoLockClosedOutline />
                ) : (
                  <IoLockOpenOutline />
                )}
              </button>
              <button
                data-tooltip-id="tooltip"
                data-tooltip-content=" Recenter"
                onClick={recenterMap}
                disabled={isLoading}
              >
                <MdOutlineCenterFocusWeak className="text-white text-xl" />
              </button>
              <button
                data-tooltip-id="tooltip"
                data-tooltip-content=" Delete"
                onClick={handleDeleteMarker}
                disabled={isLoading || selectedMapMarker?.locked}
              >
                <MdOutlineDelete className="text-white text-xl" />
              </button>
            </div>
          </div>
          <ColorButtons
            color={selectedMapMarker?.color}
            changeColor={updateMapMarkerColor}
            className="bg-transparent"
            disabled={isLoading || selectedMapMarker?.locked}
          />
          <div className="text-sm w-full flex flex-col gap-y-2">
            <div className="flex items-center w-full justify-between">
              <p className="w-1/3 text-white"> Longitude:</p>
              <Input
                type="text"
                value={longitude || "longitude..."}
                className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
                disabled={isLoading || selectedMapMarker?.locked}
                onChange={setLongitude}
                onKeyDown={onEnterPressed}
              />
            </div>
            <div className="flex items-center w-full justify-between">
              <p className="w-1/3 text-white"> Latitude: </p>
              <Input
                type="text"
                value={latitude || "latitude..."}
                className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
                disabled={isLoading || selectedMapMarker?.locked}
                onChange={setLatitude}
                onKeyDown={onEnterPressed}
              />
            </div>
            <div className="flex items-center w-full justify-between">
              <p className="w-1/3 text-white"> Elevation: </p>
              <Input
                type="text"
                value={elevation || "elevation..."}
                className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
                disabled={isLoading || selectedMapMarker?.locked}
                onChange={setElevation}
                onKeyDown={onEnterPressed}
              />
            </div>
            <hr className="my-2" />
            <div className="text-white">
              <p className="mb-2">Created By:</p>
              <p>{selectedMapMarker?.created_by?.name}</p>
              <p>{selectedMapMarker?.created_by?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedMarkerDrawer;
