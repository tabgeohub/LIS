import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import toast from "react-hot-toast";
import type { EnrichedPointType } from "Types";
import { isNearExistingPoint } from "./isNearExistingPoint";

type ApplyGraphicPositionInput = {
  longitude: number;
  latitude: number;
  points: EnrichedPointType[];
  warning: string;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  setXCoord: (v: number) => void;
  setYCoord: (v: number) => void;
  setLongitude: (v: number) => void;
  setLatitude: (v: number) => void;
  setStep: (v: number) => void;
  logAction: (entry: {
    message: string;
    step: string;
    newData: Record<string, unknown>;
  }) => void;
};

export function commitGraphicPosition(input: ApplyGraphicPositionInput) {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.longitude,
    y: input.latitude,
  });
  input.setXCoord(transformed.x);
  input.setYCoord(transformed.y);
  input.setLongitude(input.longitude);
  input.setLatitude(input.latitude);
  input.redGraphicsLayer?.add(createPoint(input.longitude, input.latitude));
  input.logAction({
    message: "User clicked 'Next' button",
    step: "Second step",
    newData: { latitude: input.latitude, longitude: input.longitude },
  });
  input.setStep(3);
}

export function applyGraphicPositionNext(input: ApplyGraphicPositionInput) {
  if (
    isNearExistingPoint({
      lon: input.longitude,
      lat: input.latitude,
      points: input.points,
    })
  ) {
    toast.error(input.warning);
    return;
  }
  commitGraphicPosition(input);
}
