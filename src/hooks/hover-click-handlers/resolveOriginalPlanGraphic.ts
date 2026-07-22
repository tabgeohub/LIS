import { FlightPlanType } from "Types";

export type OriginalGraphicsMapRef = {
  current: Map<number, __esri.Graphic> | Map<string, __esri.Graphic>;
};

/** Resolve original graphic from a map keyed by plan id (number or string). */
export function resolveOriginalPlanGraphic(input: {
  plan: FlightPlanType;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): __esri.Graphic | undefined {
  const map = input.originalGraphicsMap.current as Map<
    string | number,
    __esri.Graphic
  >;
  return map.get(input.plan.id) ?? map.get(String(input.plan.id));
}
