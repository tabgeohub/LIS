import CoordinateFields from "Components/HomePage/Body/Left/Common/CoordinateFields";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";

export default function CoordinatesInput() {
  const pointState = useEnrichedPointState();
  const logAction = useLogAction();
  const labels = useContent().voorbereiding.aandachtspuntAanmaken.step3;

  return (
    <CoordinateFields
      {...pointState}
      labels={{
        coordinateSystem: labels.Coördinatensysteem,
        coordinates: labels.coordinates,
        x: labels.x,
        y: labels.y,
        longitude: labels.long,
        latitude: labels.lat,
      }}
      onCoordinateSystemChange={(value) =>
        logAction({
          message: `User selected ${value} coordinate system`,
          step: "Add point",
        })
      }
      onYChange={(value) =>
        logAction({
          message: `User entered ${value} in Y coordinate`,
          step: "Add point",
        })
      }
    />
  );
}
