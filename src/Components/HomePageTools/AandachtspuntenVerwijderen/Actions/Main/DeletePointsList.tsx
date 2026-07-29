import SinglePoint from "./SinglePoint";
import { useContent } from "hooks/useContent";

export function DeletePointsList(props: {
  pointsLength: number;
  sortedPoints: { id: number }[];
}) {
  const content = useContent();
  return (
    <div className="pb-40">
      {props.pointsLength === 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-400 text-[12px]">
            {content.tools.aandachtspuntenVerwijderen.pointsList.noPoints}{" "}
          </p>
        </div>
      )}
      {props.sortedPoints.map((point) => (
        <SinglePoint key={point.id} point={point as never} />
      ))}
    </div>
  );
}
