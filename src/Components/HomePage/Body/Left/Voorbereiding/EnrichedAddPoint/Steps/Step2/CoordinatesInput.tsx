import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { SpatialReference } from "Types";

export default function CoordinatesInput() {
  const {
    xCoord,
    yCoord,
    coordinateSystem,
    setCoordinateSystem,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setXCoord,
    setYCoord,
  } = useEnrichedPointState();

  const logAction = useLogAction();

  const content = useContent();

  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">
          {content.voorbereiding.aandachtspuntAanmaken.step3.Coördinatensysteem}
          :
        </p>

        <select
          className="col-span-4 inputClass"
          name=""
          id=""
          value={coordinateSystem}
          onChange={(e) => {
            setCoordinateSystem(e.target.value as SpatialReference);

            logAction({
              message: `User selected ${e.target.value} coordinate system`,
              step: "Add point",
            });
          }}
        >
          <option value="RD">
            {content.voorbereiding.aandachtspuntAanmaken.step3.coordinates.at(
              0
            )}
          </option>
          <option value="WGS84">
            {content.voorbereiding.aandachtspuntAanmaken.step3.coordinates.at(
              1
            )}
          </option>
        </select>
      </div>

      {coordinateSystem === "RD" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.voorbereiding.aandachtspuntAanmaken.step3.x}
            </p>
            <input
              className="inputClass col-span-4 !w-[60%]"
              type="number"
              value={xCoord}
              onChange={(e) => setXCoord(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.voorbereiding.aandachtspuntAanmaken.step3.y}
            </p>
            <input
              className="inputClass col-span-4 !w-[60%]"
              type="number"
              value={yCoord}
              onChange={(e) => {
                setYCoord(Number(e.target.value));

                logAction({
                  message: `User entered ${e.target.value} in Y coordinate`,
                  step: "Add point",
                });
              }}
            />
          </div>
        </>
      )}

      {coordinateSystem === "WGS84" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.voorbereiding.aandachtspuntAanmaken.step3.long}
            </p>
            <input
              className="inputClass col-span-4 !w-[60%]"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.voorbereiding.aandachtspuntAanmaken.step3.lat}
            </p>
            <input
              className="inputClass col-span-4 !w-[60%]"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  );
}
