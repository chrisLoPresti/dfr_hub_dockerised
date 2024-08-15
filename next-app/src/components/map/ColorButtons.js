import { BsCheck } from "react-icons/bs";
import classNames from "classnames";
import useMapMarkers from "@/hooks/useMapMarkers";

const ColorButtons = ({ className, color, changeColor, disabled }) => {
  const {
    markerColors = {},
    setDefaultMarkerColor,
    defaultMarkerColor,
  } = useMapMarkers();

  const handleChangeColor = (color) => () => {
    if (changeColor) {
      changeColor(color);
    } else {
      setDefaultMarkerColor(color);
    }
  };

  return (
    <div
      className={classNames("bg-white flex shadow-sm rounded-sm p-2 gap-x-2", {
        [className]: className,
        "opacity-30": disabled,
      })}
      data-tooltip-id="tooltip"
      data-tooltip-content="Change default marker color"
      disabled={disabled}
    >
      {Object.keys(markerColors).map((key) => (
        <button
          key={key}
          className={`bg-${key}-annotation w-5 h-5 flex justify-center items-center`}
          onClick={handleChangeColor(key)}
          disabled={disabled}
        >
          {(color || defaultMarkerColor) === key ? (
            <BsCheck className="text-white text-xl" />
          ) : (
            ""
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorButtons;
