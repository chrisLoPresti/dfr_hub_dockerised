import useMapMarkers from "@/hooks/useMapMarkers";
import classNames from "classnames";
import { FaArrowDownUpAcrossLine, FaArrowDownUpLock } from "react-icons/fa6";

const LockMarkersButton = () => {
  const { canDragMarkers, toggleCanDragMarkers } = useMapMarkers();

  return (
    <button
      className={classNames(
        "rounded-sm p-2 shadow-lg bg-white border-2 ml-2 absolute top-32 right-2.5 flex",
        {
          "text-blue-annotation border-blue-annotation bg-gradient-to-tr from-white from-80% to-blue-annotation to-90%":
            canDragMarkers,
          "border-white": !canDragMarkers,
        }
      )}
      onClick={toggleCanDragMarkers}
      data-tooltip-id="tooltip"
      data-tooltip-content={`${
        canDragMarkers ? "Unlock" : "Lock"
      } marker dragging`}
    >
      {canDragMarkers ? <FaArrowDownUpLock /> : <FaArrowDownUpAcrossLine />}
    </button>
  );
};

export default LockMarkersButton;
