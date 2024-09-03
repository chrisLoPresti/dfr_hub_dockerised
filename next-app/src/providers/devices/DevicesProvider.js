"use client";

import { useSocket } from "@/hooks/useSocket";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const DeviceContext = createContext({
  devices: [],
  selectedDevice: null,
});

export const useDeviceContext = () => useContext(DeviceContext);

export const DevicesProvider = ({ children }) => {
  const { emit, on, off, connect } = useSocket();
  const devices = [
    {
      serial_number: "1581F5BKD225500BKP32",
      workspace_id: "030bef84-d797-4393-a07f-d9719a3833d2",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-IainWaldrum",
      stream_id: "ianw",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5FJC246400D146B",
      workspace_id: "000d2480-4b6b-11ef-9df9-073b7feb06da",
      ntfy: "terrestrial-uas",
      agency: "terrestial-Mario3T",
      stream_id: "mario3t",
      device: "Mavic 3 Thermal",
      image: "/images/drones/mavic_3t.png",
    },
    {
      serial_number: "1581F5BKD223Q00A520F",
      workspace_id: "030a6a94-3c84-11ef-8ace-570f0d051196",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-ChrisM30T",
      stream_id: "tchris",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5BKB243100F016R",
      workspace_id: "030b94f4-09c2-480a-9faa-21c10971828d",
      ntfy: "UnmannedAR-raptor",
      agency: "unmannedar-chrisM30T",
      stream_id: "chris",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5FJD228K00A0294",
      workspace_id: "003edf4e-63f8-4a86-bd5c-32965ec038eb",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-ChrisM3T",
      stream_id: "tchrism3t",
      device: "Mavic 3 Thermal",
      image: "/images/drones/mavic_3t.png",
    },
  ];

  const [selectedDevice, setSelectedDevice] = useState(null);

  const selectDevice = useCallback(
    (index) => () => {
      connect();
      emit("unsubscribe-to-real-time-updates", selectDevice.serial_number);
      setSelectedDevice(devices[index]);
      emit("subscribe-to-real-time-updates", devices[index].serial_number);
    },
    [selectedDevice, emit]
  );

  const messageHandler = (message) => {
    console.log(message);
  };

  useEffect(() => {
    on("unsubscribe-to-real-time-updates-failed", messageHandler);
    return () => {
      off("unsubscribe-to-real-time-updates-failed", messageHandler);
    };
  }, [on, off]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        selectDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
