"use client";

import classNames from "classnames";
import { useState } from "react";
import Draggable from "react-draggable";
import { BsArrowsFullscreen, BsArrowsAngleContract } from "react-icons/bs";
import Iframe from "react-iframe";

const defaultDimenstions = {
  height: "352px",
  width: "529px",
};

const fullScreenDimensions = {
  height: "100%",
  width: "100%",
};

const defaultPosition = { x: 200, y: 98 };

const LiveStream = ({ endPoint, closeEndpoint }) => {
  const [screenSize, setScreenSize] = useState(defaultDimenstions);
  const [position, setPosition] = useState(null);

  const toggleScreenSize = () => {
    if (screenSize.height === "100%") {
      setScreenSize(defaultDimenstions);
      setPosition(null);
    } else {
      setScreenSize(fullScreenDimensions);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    endPoint && (
      <Draggable
        bounds="parent"
        position={position}
        defaultPosition={defaultPosition}
      >
        <div
          className={classNames(
            "bg-slate-900 z-50 flex justify-between flex-col z-50 absolute cursor-move",
            {
              "": screenSize.height === "100%",
              "rounded-md": screenSize.height !== "100%",
            }
          )}
          style={{ ...screenSize }}
        >
          <Iframe
            url={endPoint}
            {...screenSize}
            className={classNames("block relative cursor-none", {
              "": screenSize.height === "100%",
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
              onClick={closeEndpoint}
            >
              Close Stream
            </button>
          </div>
        </div>
      </Draggable>
    )
  );
};

export default LiveStream;
