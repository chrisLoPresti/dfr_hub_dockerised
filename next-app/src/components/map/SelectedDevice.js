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
import { FaWind, FaSdCard } from "react-icons/fa";
import { MdWbTwilight } from "react-icons/md";
import classNames from "classnames";
import * as egm96 from "egm96-universal";
import { TbHomeDot, TbNavigationFilled, TbHomeStats } from "react-icons/tb";
import { CiStreamOn } from "react-icons/ci";
import { IoIosCloudUpload, IoMdShareAlt } from "react-icons/io";
import CopyToClipboard from "react-copy-to-clipboard";
import { successToast } from "../atoms/Toast";

const defaultPosition = { x: 200, y: 98 };

const units = {
  ft: {
    label: "ft",
    conversion: 3.28084,
    speed: {
      label: "mph",
      conversion: 0.621371,
    },
  },
  m: {
    label: "m",
    conversion: 1,
    speed: {
      label: "km/h",
      conversion: 1,
    },
  },
};

const SelectedDevice = ({ realTimeDroneData }) => {
  const { selectedDevice } = useDeviceContext();
  const [lastPosition, setLastPosition] = useState(defaultPosition);
  const [unit, setUnit] = useState(units.ft);
  const [liveStreamScreenSize, setliveStreamScreenSize] = useState("sm");

  const [liveStreamLink, setLiveStreamLink] = useState(null);
  const dragRef = useRef(null);

  const toggleliveStreamScreenSize = () => {
    if (liveStreamScreenSize === "sm") {
      dragRef.current.style.transform = "translate(0px,0px)";
      setliveStreamScreenSize("lg");
    } else {
      dragRef.current.style.transform = `translate(${lastPosition.x},${lastPosition.y})`;
      setliveStreamScreenSize("sm");
    }
  };

  const normalizeHeading = (heading) => {
    let normalizedHeading = heading % 360;
    if (normalizedHeading < 0) {
      normalizedHeading += 360;
    }
    return normalizedHeading;
  };

  const onDrag = () => {
    if (liveStreamScreenSize === "lg") {
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

  const heading = normalizeHeading(realTimeDroneData?.data?.attitude_head ?? 0);

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
            "top-24 left-2.5 text-xs text-white flex items-center justify-center flex-col bg-slate-500 rounded-md w-1/2",
            {
              "absolute h-auto": !liveStreamLink,
              "w-full h-full": liveStreamScreenSize === "lg",
            }
          )}
          key={selectedDevice?.serial_number}
          style={
            liveStreamScreenSize === "sm"
              ? { minWidth: "700px", maxWidth: "800px" }
              : {}
          }
        >
          <div className="cursor-move flex items-center justify-between bg-slate-800 w-full p-2 rounded-t-md gap-2">
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
          <div className="w-full h-full flex" style={{ fontSize: "16px" }}>
            <div
              className="bg-slate-700 h-auto w-2/12 relative flex"
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
            <div className="w-10/12 p-2 flex flex-wrap">
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
                <div
                  className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2"
                  data-tooltip-content="Wind speed"
                  data-tooltip-id="tooltip"
                >
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
                <div
                  className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2"
                  data-tooltip-content="Strobe light status"
                  data-tooltip-id="tooltip"
                >
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
                <div
                  className="flex items-center justify-center gap-1 bg-slate-700 rounded-md py-1 px-2"
                  data-tooltip-content="Available storage remaining"
                  data-tooltip-id="tooltip"
                >
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
                    <div
                      className={
                        "mx-auto flex flex-col items-center justify-center w-full gap-2"
                      }
                      data-tooltip-content="Drone heading"
                      data-tooltip-id="tooltip"
                    >
                      <TbNavigationFilled
                        className="text-blue-500"
                        style={{
                          transform: `rotate(${heading}deg)`,
                        }}
                      />
                      <p className="text-sm text-white w-full text-center">
                        {" "}
                        {heading} °
                      </p>
                    </div>
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
                  <div className="flex w-10/12 overflow-hidden flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <div
                        className="flex items-center truncate w-1/3 p-1 gap-2"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Maximum altitude"
                      >
                        <IoIosCloudUpload className="text-yellow-500 ml-2" />
                        {(
                          Math.round(
                            realTimeDroneData?.data?.height_limit *
                              unit.conversion *
                              100
                          ) / 100
                        ).toFixed(2)}{" "}
                        {unit.label}
                      </div>
                      <div
                        className="flex items-center truncate w-1/3 p-1 gap-2"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Return to home altitude"
                      >
                        <TbHomeStats className="text-yellow-500 ml-2" />
                        {(
                          Math.round(
                            realTimeDroneData?.data?.rth_altitude *
                              unit.conversion *
                              100
                          ) / 100
                        ).toFixed(2)}{" "}
                        {unit.label}
                      </div>
                      <div
                        className="flex items-center truncate w-1/3 p-1 gap-2"
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Distance from homepoint"
                      >
                        <TbHomeDot className="text-yellow-500 ml-2" />
                        {(
                          Math.round(
                            realTimeDroneData?.data?.home_distance *
                              unit.conversion *
                              100
                          ) / 100
                        ).toFixed(2)}{" "}
                        {unit.label}
                      </div>
                    </div>
                    <div className="w-full flex">
                      <p
                        className="truncate	w-1/2 p-1"
                        data-tooltip-id="tooltip"
                        data-tooltip-content={realTimeDroneData?.data?.latitude}
                      >
                        Lat: {realTimeDroneData?.data?.latitude} °
                      </p>
                      <p
                        className="truncate	w-1/2 p-1"
                        data-tooltip-id="tooltip"
                        data-tooltip-content={
                          realTimeDroneData?.data?.longitude
                        }
                      >
                        Lon: {realTimeDroneData?.data?.longitude} °
                      </p>
                    </div>
                    <div className="w-full flex">
                      <p
                        className="truncate w-1/4 p-1"
                        data-tooltip-content="Height above sea level"
                        data-tooltip-id="tooltip"
                      >
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
                      <p
                        className="truncate w-1/4 p-1"
                        data-tooltip-content="Height above ground level"
                        data-tooltip-id="tooltip"
                      >
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
                      <p
                        className="truncate w-1/4 p-1"
                        data-tooltip-content="Horizontal Speed"
                        data-tooltip-id="tooltip"
                      >
                        HS:{" "}
                        {(
                          Math.round(
                            realTimeDroneData?.data?.horizontal_speed *
                              unit.speed.conversion *
                              100
                          ) / 100
                        ).toFixed(2)}{" "}
                        {unit.speed.label}
                      </p>
                      <p
                        className="truncate w-1/4 p-1"
                        data-tooltip-content="Vertical Speed"
                        data-tooltip-id="tooltip"
                      >
                        VS:{" "}
                        {(
                          Math.round(
                            realTimeDroneData?.data?.vertical_speed *
                              unit.speed.conversion *
                              100
                          ) / 100
                        ).toFixed(2)}{" "}
                        {unit.speed.label}
                      </p>
                    </div>
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
                        data-tooltip-content="Battery Percentage"
                        data-tooltip-id="tooltip"
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
              {!liveStreamLink && (
                <div className="w-full p-1 flex justify-end gap-2">
                  <CopyToClipboard
                    text={`https://unmannedar.com/getlive.html?key=${selectedDevice?.stream_id}`}
                    onCopy={() => successToast("Copied live stream link!")}
                  >
                    <div className="flex items-center gap-1 rounded-md p-1 px-2 hover:bg-opacity-60 bg-slate-700 cursor-pointer">
                      <IoMdShareAlt className="text-xl" /> Share Live Stream
                      Link
                    </div>
                  </CopyToClipboard>
                  <button
                    className="flex items-center gap-1 rounded-md p-1 px-2 hover:bg-opacity-60 bg-slate-700"
                    onClick={() =>
                      setLiveStreamLink(
                        `https://unmannedar.com/getlive.html?key=${selectedDevice?.stream_id}`
                      )
                    }
                  >
                    <CiStreamOn className="text-xl" /> Live Stream
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            className={classNames(
              "bg-slate-900 z-50 flex flex-col items-center justify-center w-full rounded-b min-w-full",
              {
                hidden: !liveStreamLink,
                "absolute h-full": liveStreamScreenSize === "lg",
              }
            )}
            style={liveStreamScreenSize === "sm" ? { height: "400px" } : {}}
          >
            <Iframe
              url={liveStreamLink}
              className="block relative cursor-none h-full min-w-full"
              height={400}
              width={400}
            />
            <div className="p-2 flex w-full justify-between">
              <button
                className="text-white rounded-md p-2 bg-slate-700"
                onClick={toggleliveStreamScreenSize}
              >
                <BsArrowsAngleContract />
                {/* <BsArrowsFullscreen /> */}
              </button>
              <button
                className="text-sm bg-slate-700 text-white rounded-md p-2 ml-auto"
                onClick={() => {
                  setLiveStreamLink(null);
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
