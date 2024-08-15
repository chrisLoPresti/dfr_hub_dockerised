import classNames from "classnames";
import { useState } from "react";
import { TbDiamonds } from "react-icons/tb";
import ColorButtons from "./ColorButtons";
import useMapMarkers from "@/hooks/useMapMarkers";

const CreatePinPointButton = () => {
  const { defaultMarkerColor, canCreateMapMarkers, toggleCanCreateMapMarkers } =
    useMapMarkers();
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const showColorPicker = () => {
    setOpenColorPicker(true);
  };

  const hideColorPicker = () => {
    setOpenColorPicker(false);
  };

  return (
    <div
      className="absolute top-20 right-2.5 flex"
      onMouseEnter={showColorPicker}
      onMouseLeave={hideColorPicker}
    >
      {openColorPicker && <ColorButtons />}
      <button
        className={classNames(
          "rounded-sm p-2 shadow-lg bg-white border-2 ml-2",
          {
            [`text-${defaultMarkerColor}-annotation border-${defaultMarkerColor}-annotation bg-gradient-to-tr from-white from-80% to-${defaultMarkerColor}-annotation to-90%`]:
              canCreateMapMarkers,
            "border-white": !canCreateMapMarkers,
          }
        )}
        onClick={toggleCanCreateMapMarkers}
        data-tooltip-id="tooltip"
        data-tooltip-content={`${
          canCreateMapMarkers ? "Disable" : "Enable"
        } click to create markers`}
      >
        <TbDiamonds />
      </button>
    </div>
  );
};
export default CreatePinPointButton;
