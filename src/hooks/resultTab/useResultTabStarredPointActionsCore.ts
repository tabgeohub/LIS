import { useState } from "react";
import { EnrichedPointType } from "Types";
import useLogAction from "hooks/useLogAction";
import usePointListMapActions from "hooks/hover-click-handlers/usePointListMapActions";

export function useResultTabStarredPointActions() {
  const logAction = useLogAction();
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);

  const { hoverPoint, clearHover, goToPoint, toggleStarPoint } =
    usePointListMapActions({
      starredPoints,
      setStarredPoints,
      onStar: (point) => {
        logAction({
          message: `User starred point '${point.omschrijving}' in the list of starred points`,
          step: "ResultTab",
        });
      },
      onUnstar: (point) => {
        logAction({
          message: `User removed point '${point.omschrijving}' from the list of starred points`,
          step: "ResultTab",
        });
      },
      onGoTo: (point) => {
        logAction({
          message: `User clicked on point '${point.omschrijving}' in the list of starred points`,
          step: "ResultTab ( goToPoint function )",
        });
      },
    });

  return {
    starredPoints,
    setStarredPoints,
    hoverPoint,
    clearHover,
    goToPoint,
    toggleStarPoint,
  };
}
