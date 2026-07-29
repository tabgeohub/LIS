import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { AddToPlanStepButtonBar } from "../AddToPlanStepButtonBar";

export default function Buttons(props: AddToPlanStepButtonsProps) {
  const { setPolygonPoints, polygonPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();

  return (
    <AddToPlanStepButtonBar
      {...props}
      onNext={(actions) => {
        actions.submitSelection({
          addedPointIds: polygonPoints.map((point) => point.id),
          afterSubmit: () => {
            yellowGraphicsLayer?.removeAll();
            setPolygonPoints([]);
          },
        });
      }}
    />
  );
}
