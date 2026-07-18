import {
  buildPointUpdatePayload,
  type PointUpdateFormFields,
} from "@helpers/points/buildPointUpdatePayload";
import type { EnrichedPointType } from "Types";
import { applyDeletePointUpdateSuccess } from "./applyDeletePointUpdateSuccess";

type UpdateFn = (input: {
  data: ReturnType<typeof buildPointUpdatePayload>;
  onSuccess?: (responseData: { result?: EnrichedPointType }) => void;
}) => void;

/** Shared Step1/Step2 save path for delete-point edit details. */
export function submitDeletePointDetailsUpdate(input: {
  selectedPoint: EnrichedPointType | null | undefined;
  formFields: PointUpdateFormFields;
  update: UpdateFn;
  points: EnrichedPointType[];
  setPoints: (points: EnrichedPointType[]) => void;
  mapView: __esri.MapView | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer?: __esri.GraphicsLayer | null | undefined;
  onApplied: () => void;
}): void {
  const { selectedPoint } = input;
  if (!selectedPoint) return;

  const newPoint = buildPointUpdatePayload({
    fields: input.formFields,
    id: selectedPoint.id,
    created_at: selectedPoint.created_at,
  });

  input.update({
    data: newPoint,
    onSuccess: (responseData) => {
      if (!responseData.result) return;

      applyDeletePointUpdateSuccess({
        points: input.points,
        result: responseData.result,
        setPoints: input.setPoints,
        mapView: input.mapView,
        redGraphicsLayer: input.redGraphicsLayer,
        yellowGraphicsLayer: input.yellowGraphicsLayer,
      });
      input.onApplied();
    },
  });
}
