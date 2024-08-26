import useMapMarkers from "@/hooks/useMapMarkers";
import classNames from "classnames";
import { useState } from "react";
import Checkbox from "react-custom-checkbox";
import { TbDiamonds, TbTrash, TbCheck } from "react-icons/tb";

const Annotations = ({ visible }) => {
  const [checkedMarkers, setCheckedMarkers] = useState([]);
  const { markers, selectMapMarker, selectedMapMarker, deleteMapMarker } =
    useMapMarkers();

  const handleSelectMapMarker = (marker) => () => {
    selectMapMarker(marker);
  };

  const handleCheckAllMarkers = () => {
    if (!checkedMarkers.length || checkedMarkers.length !== markers.length) {
      setCheckedMarkers([...markers]);
    } else {
      setCheckedMarkers([]);
    }
  };

  const handleCheckMarker = (marker) => () => {
    const matchingIndex = checkedMarkers.findIndex(
      ({ _id }) => _id === marker._id
    );

    if (matchingIndex >= 0) {
      checkedMarkers.splice(matchingIndex, 1);
      setCheckedMarkers([...checkedMarkers]);
    } else {
      setCheckedMarkers([...checkedMarkers, marker]);
    }
  };

  const handleDeleteSelection = async () => {
    const deletedMarkers = [];
    await Promise.all(
      checkedMarkers.map(async (marker) => {
        const deletedMarker = await deleteMapMarker(marker);
        if (deletedMarker) {
          deletedMarkers.push(deletedMarker._id);
        }
      })
    );
    setCheckedMarkers(
      checkedMarkers.filter(({ _id }) => !deletedMarkers.includes(_id))
    );
  };

  return visible ? (
    <div className="flex flex-col truncate">
      <p className="my-5 ml-5">Map Annotations</p>
      <div className="flex justify-between items-center gap-x-2 text-xl py-2 p-5">
        <Checkbox
          className={classNames("border-white cursor-pointer", {
            "bg-blue-500":
              checkedMarkers.length !== 0 &&
              checkedMarkers.length === markers.length,
          })}
          borderColor="white"
          icon={<TbCheck className="text-white" />}
          size={16}
          checked={
            checkedMarkers.length !== 0 &&
            checkedMarkers.length === markers.length
          }
          onChange={handleCheckAllMarkers}
        />
        <button
          disabled={!checkedMarkers.length}
          className="ml-auto cursor-pointer rounded-full p-1 hover:bg-red-500 hover:shadow"
          data-tooltip-id="tooltip"
          data-tooltip-content="Delete Selection"
          onClick={handleDeleteSelection}
        >
          <TbTrash />
        </button>
      </div>
      <hr className="w-full my-2" />
      {markers?.map((currMarker) => {
        const { _id, name, color } = currMarker;
        const checked = checkedMarkers.find(
          ({ _id: currId }) => currId === _id
        );
        return (
          <div
            key={_id}
            data-tooltip-id="tooltip"
            data-tooltip-content={name}
            className={classNames(
              "flex justify-left items-center gap-x-2 text-xl py-2 cursor-pointer p-5",
              {
                "bg-white bg-opacity-10": selectedMapMarker?._id === _id,
              }
            )}
            onClick={handleSelectMapMarker(currMarker)}
          >
            <Checkbox
              className={classNames("border-white cursor-pointer", {
                "bg-blue-500": checked,
              })}
              borderColor="white"
              size={16}
              checked={checked}
              icon={<TbCheck className="text-white" />}
              onChange={handleCheckMarker(currMarker)}
            />
            <TbDiamonds className={`text-${color}-annotation`} />
            <p className="overflow-hidden text-ellipsis text-sm">{name}</p>
          </div>
        );
      })}
    </div>
  ) : null;
};

export default Annotations;
