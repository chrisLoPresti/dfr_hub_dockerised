import { successToast } from "@/components/atoms/Toast";
import { useDeviceContext } from "@/providers/devices/DevicesProvider";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

const Devices = ({ visible }) => {
  const { devices, selectDevice } = useDeviceContext();
  return visible ? (
    <div className="flex flex-col truncate p-5 gap-y-5">
      <p>Stored Devices</p>
      {devices.map(
        (
          { serial_number, workspace_id, ntfy, image, agency, device },
          index
        ) => (
          <div
            className="text-sm w-full flex gap-y-2 items-center justify-center flex-col bg-white bg-opacity-10 rounded-md p-5"
            key={serial_number}
          >
            <p>{agency}</p>
            <Image src={image} alt={device} width={150} height={150} />
            <div className="text-neutral-300 w-full">
              <p className="underline">Device: </p>
              <p>{device}</p>
            </div>
            <div className="text-neutral-300 w-full">
              <div className="flex gap-x-2 items-center">
                <p className="underline">Serial Number: </p>
                <CopyToClipboard
                  text={serial_number}
                  onCopy={() =>
                    successToast(`Copied serial number ${serial_number}`)
                  }
                >
                  <button
                    className="hover:bg-slate-700 rounded-full p-2"
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Copy to clipbaord"
                  >
                    <MdContentCopy className="" />
                  </button>
                </CopyToClipboard>
              </div>
              {serial_number}
            </div>
            <div className="text-neutral-300 w-full whitespace-normal">
              <div className="flex gap-x-2 items-center">
                <p className="underline">Workspace ID: </p>
                <CopyToClipboard
                  text={workspace_id}
                  onCopy={() =>
                    successToast(`Copied serial number ${workspace_id}`)
                  }
                >
                  <button
                    className="hover:bg-slate-700 rounded-full p-2"
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Copy to clipbaord"
                  >
                    <MdContentCopy />
                  </button>
                </CopyToClipboard>
              </div>
              {workspace_id}
            </div>
            <button
              className="w-full p-2 bg-slate-700 rounded-md hover:bg-opacity-60"
              onClick={selectDevice(index)}
            >
              Make Active Device
            </button>
          </div>
        )
      )}
    </div>
  ) : null;
};

export default Devices;
