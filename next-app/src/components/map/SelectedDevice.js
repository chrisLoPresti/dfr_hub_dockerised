"use client";

import { useDeviceContext } from "@/providers/devices/DevicesProvider";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { BsArrowsFullscreen, BsArrowsAngleContract } from "react-icons/bs";
import Iframe from "react-iframe";
import {
  GiBattery25,
  GiBattery50,
  GiBattery75,
  GiBattery100,
} from "react-icons/gi";
import { MdOutlineSatelliteAlt } from "react-icons/md";
import { FaWind, FaSdCard, FaLocationArrow } from "react-icons/fa";
import { MdWbTwilight } from "react-icons/md";
import classNames from "classnames";
import * as egm96 from "egm96-universal";
import { TbHomeDot } from "react-icons/tb";

const defaultDimenstions = {
  height: "352px",
  width: "629px",
};

const fullScreenDimensions = {
  height: "100%",
  width: "100%",
};

const defaultPosition = { x: 200, y: 98 };

const units = {
  ft: {
    label: "ft",
    conversion: 3.28084,
  },
  m: {
    label: "m",
    conversion: 1,
  },
};

const SelectedDevice = ({ realTimeDroneData }) => {
  const [screenSize, setScreenSize] = useState(defaultDimenstions);
  const { selectedDevice } = useDeviceContext();
  const [lastPosition, setLastPosition] = useState(null);
  const [unit, setUnit] = useState(units.ft);

  const [liveStreamLink, setLiveStreamLink] = useState(null);
  const dragRef = useRef(null);

  const toggleScreenSize = () => {
    if (screenSize.height === "100%") {
      setScreenSize(defaultDimenstions);
      dragRef.current.style.transform = `translate(${lastPosition.x},${lastPosition.y})`;
    } else {
      setScreenSize(fullScreenDimensions);
      dragRef.current.style.transform = "translate(0px,0px)";
    }
  };

  const onDrag = () => {
    if (screenSize.height === "100%") {
      return;
    }

    let transform = dragRef.current.style.getPropertyValue("transform");
    transform = transform.replace("translate", "");
    transform = transform.replace("(", "");
    transform = transform.replace(")", "");
    const xy = transform.split(",");
    const newLastPosition = { x: xy[0], y: xy[1] };
    setLastPosition(newLastPosition);
  };
  console.log(realTimeDroneData);
  return (
    selectedDevice && (
      <Draggable
        bounds="parent"
        defaultPosition={defaultPosition}
        onDrag={onDrag}
      >
        <div
          ref={dragRef}
          className={classNames(
            "top-24 left-2.5 text-xs text-white flex items-center justify-center flex-col bg-slate-500 rounded-md",
            {
              "absolute h-auto": !liveStreamLink,
              "w-full h-full": screenSize.height === "100%",
            }
          )}
          key={selectedDevice?.serial_number}
          style={screenSize.height !== "100%" ? { width: "600px" } : {}}
        >
          <div className="cursor-move flex items-center justify-between bg-slate-900 w-full p-2 rounded-t-md gap-2">
            <div>
              {selectedDevice?.agency}
              <div className="flex gap-1">
                <p>SN: </p>
                {selectedDevice?.serial_number}
              </div>
            </div>
            <button className="rounded-full py-2 px-3 hover:bg-slate-700">
              x
            </button>
          </div>
          <div className="w-full h-full flex" style={{ fontSize: "18px" }}>
            <div
              className="bg-slate-700 h-auto w-1/4 relative flex"
              style={{
                backgroundImage: `url(${selectedDevice?.image})`,
                "background-repeat": "no-repeat",
                "background-size": "contain",
                "background-position": "center",
              }}
            >
              <p className="text-center mt-auto w-full p-2">
                {selectedDevice?.device}
              </p>
            </div>
            <div className="w-3/4 p-2 flex flex-wrap">
              <div className="p-1 w-1/4">
                <div
                  className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2"
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Number of satellites"
                >
                  {realTimeDroneData?.data?.position_state?.gps_number}
                  <MdOutlineSatelliteAlt
                    className={classNames({
                      "text-red-500":
                        realTimeDroneData?.data?.position_state?.gps_number <=
                        12,
                      "text-yellow-500":
                        realTimeDroneData?.data?.position_state?.gps_number <=
                        16,
                      "text-green-500":
                        realTimeDroneData?.data?.position_state?.gps_number >
                        16,
                    })}
                  />
                </div>
              </div>
              <div className="p-1 w-1/4">
                <div className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2">
                  {realTimeDroneData?.data?.wind_speed}
                  <FaWind
                    className={classNames({
                      "text-red-500": realTimeDroneData?.data?.wind_speed >= 20,
                      "text-yellow-500":
                        realTimeDroneData?.data?.wind_speed <= 12 &&
                        realTimeDroneData?.data?.wind_speed < 20,
                      "text-blue-500": realTimeDroneData?.data?.wind_speed < 12,
                    })}
                  />
                </div>
              </div>
              <div className="p-1 w-1/4">
                <div className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2">
                  {realTimeDroneData?.data?.night_lights_state === 0
                    ? "off"
                    : "on"}
                  <MdWbTwilight
                    className={classNames({
                      "text-yellow-500":
                        realTimeDroneData?.data?.night_lights_state === 1,
                    })}
                  />
                </div>
              </div>
              <div className="p-1 w-1/4">
                <div className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2">
                  <p>
                    {(
                      Math.round(
                        (realTimeDroneData?.data?.storage?.used / 1000000) * 100
                      ) / 100
                    ).toFixed(2)}
                    G
                  </p>
                  {/* /
                {(
                  Math.round(
                    (realTimeDroneData?.data?.storage?.total / 1000000) * 100
                  ) / 100
                ).toFixed(2)}
                GB */}
                  <FaSdCard
                    className={classNames({
                      "text-red-500": !realTimeDroneData?.data?.storage?.total,
                    })}
                  />
                </div>
              </div>
              <div className="w-full p-1">
                <div className="flex w-full items-center bg-slate-700 rounded-md p-2 gap-4">
                  <div className="w-2/12 flex items-center justify-center flex-col gap-4">
                    <FaLocationArrow className="text-blue-500 mx-auto" />
                    <div className="w-full flex gap-2">
                      <button
                        className={classNames(
                          "text-sm rounded-md w-1/2 p-1 bg-slate-500",
                          {
                            "opacity-60": unit.label !== "m",
                          }
                        )}
                        data-tooltip-content="Set units to meters"
                        data-tooltip-id="tooltip"
                        onClick={() => setUnit(units.m)}
                      >
                        M
                      </button>
                      <button
                        className={classNames(
                          "text-sm rounded-md w-1/2 p-1 bg-slate-500",
                          {
                            "opacity-60": unit.label !== "ft",
                          }
                        )}
                        data-tooltip-content="Set units to feet"
                        data-tooltip-id="tooltip"
                        onClick={() => setUnit(units.ft)}
                      >
                        Ft
                      </button>
                    </div>
                  </div>
                  <div className="flex w-10/12 overflow-hidden flex-wrap">
                    <div
                      className="flex items-center truncate w-full p-1"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Distance from homepoint"
                    >
                      <TbHomeDot className="text-yellow-500" />:{" "}
                      {(
                        Math.round(
                          realTimeDroneData?.data?.home_distance *
                            unit.conversion *
                            100
                        ) / 100
                      ).toFixed(2)}{" "}
                      {unit.label}
                    </div>
                    <p
                      className="truncate	w-1/2 p-1"
                      data-tooltip-id="tooltip"
                      data-tooltip-content={realTimeDroneData?.data?.latitude}
                    >
                      Lat: {realTimeDroneData?.data?.latitude}
                    </p>
                    <p
                      className="truncate	w-1/2 p-1"
                      data-tooltip-id="tooltip"
                      data-tooltip-content={realTimeDroneData?.data?.longitude}
                    >
                      Lon: {realTimeDroneData?.data?.longitude}
                    </p>
                    <p className="truncate w-1/2 p-1">
                      ASL:{" "}
                      {(
                        Math.round(
                          (realTimeDroneData?.data?.height -
                            egm96.egm96ToEllipsoid(
                              realTimeDroneData?.data?.latitude,
                              realTimeDroneData?.data?.longitude,
                              realTimeDroneData?.data?.elevation
                            ) +
                            realTimeDroneData?.data?.elevation) *
                            unit.conversion *
                            100
                        ) / 100
                      ).toFixed(2)}{" "}
                      {unit.label}
                    </p>
                    <p className="truncate w-1/2 p-1">
                      AGL:{" "}
                      {(
                        Math.round(
                          realTimeDroneData?.data?.elevation *
                            unit.conversion *
                            100
                        ) / 100
                      ).toFixed(2)}{" "}
                      {unit.label}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full p-1">
                <div className="w-full flex gap-2">
                  {realTimeDroneData?.data?.battery?.batteries.map(
                    ({ capacity_percent, sn }) => (
                      <div
                        key={sn}
                        className="flex items-center justify-center text-lg gap-1 bg-slate-700 rounded-md p-1 w-1/2"
                      >
                        {capacity_percent}
                        {capacity_percent >= 75 ? (
                          <GiBattery100 className="text-green-500" />
                        ) : capacity_percent >= 50 ? (
                          <GiBattery75 className="text-green-500" />
                        ) : capacity_percent >= 25 ? (
                          <GiBattery50 className="text-yellow-500" />
                        ) : (
                          <GiBattery25 className="text-red-500" />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          {!liveStreamLink && (
            <div className="rounded-b-md bg-slate-900 p-2 w-full flex justify-between">
              <button
                className="p-2 ml-auto bg-slate-500 rounded-md hover:bg-opacity-60 text-lg"
                onClick={() =>
                  setLiveStreamLink(
                    `https://unmannedar.com/getlive.html?key=${selectedDevice?.stream_id}`
                  )
                }
              >
                Start Live Steam
              </button>
            </div>
          )}
          <div
            className={classNames(
              "bg-slate-900 z-50 flex justify-between flex-col",
              {
                absolute: screenSize.height === "100%",
                "rounded-b max-w-fit": screenSize.height !== "100%",
                hidden: !liveStreamLink,
              }
            )}
            style={{ ...screenSize }}
          >
            <Iframe
              url={liveStreamLink}
              {...screenSize}
              className={classNames("block relative cursor-none max-w-full", {
                "h-full w-full": screenSize.height === "100%",
                "rounded-t-md": screenSize.height !== "100%",
              })}
            />
            <div className="p-2 flex">
              <button
                className="text-white rounded-md p-2 bg-slate-700"
                onClick={toggleScreenSize}
              >
                {screenSize.height === "100%" ? (
                  <BsArrowsAngleContract />
                ) : (
                  <BsArrowsFullscreen />
                )}
              </button>
              <button
                className="text-sm bg-slate-700 text-white rounded-md p-2 ml-auto"
                onClick={() => {
                  setLiveStreamLink(null);
                  setScreenSize(defaultDimenstions);
                }}
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    )
  );
};

export default SelectedDevice;
