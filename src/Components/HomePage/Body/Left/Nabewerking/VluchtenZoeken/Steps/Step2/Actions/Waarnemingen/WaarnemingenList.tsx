import SinglePoint from "./SinglePoint";
import SingleGeometry from "./SingleGeometry";
import type {
  FinishedGeometryType,
  FinishedPointType,
} from "Types/finished_plans";

export function WaarnemingenList(props: {
  filteredGeometries: FinishedGeometryType[];
  filteredPoints: FinishedPointType[];
  selectedGeometry: FinishedGeometryType | null;
  selectedPoint: FinishedPointType | null;
  setSelectedGeometry: (geometry: FinishedGeometryType | null) => void;
  setSelectedPoint: (point: FinishedPointType | null) => void;
}) {
  return (
    <div className="divide-y-2 pb-10">
      {props.filteredGeometries?.map((geometry) => (
        <SingleGeometry
          geometry={geometry}
          selectedGeometry={props.selectedGeometry}
          setSelectedGeometry={(geometry) => {
            props.setSelectedGeometry(geometry);
            props.setSelectedPoint(null);
          }}
          key={`geometry-${geometry.id}`}
        />
      ))}
      {props.filteredPoints?.map((point) => (
        <SinglePoint
          selectedPoint={props.selectedPoint!}
          setSelectedPoint={(point) => {
            props.setSelectedPoint(point);
            props.setSelectedGeometry(null);
          }}
          point={point}
          key={`point-${point.id}`}
        />
      ))}
    </div>
  );
}
