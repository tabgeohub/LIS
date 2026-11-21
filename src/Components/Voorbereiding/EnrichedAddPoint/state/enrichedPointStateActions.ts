import type { StoreApi } from "zustand";
import { initialEnrichedPointValues } from "./enrichedPointStateDefaults";
import { EnrichedPointState } from "./enrichedPointStateTypes";

type SetState = StoreApi<EnrichedPointState>["setState"];
type CoordinateKey = "xCoord" | "yCoord" | "longitude" | "latitude";

export function createEnrichedPointActions(set: SetState) {
  const update = <Key extends keyof typeof initialEnrichedPointValues>(
    key: Key,
    value: (typeof initialEnrichedPointValues)[Key]
  ) => set({ [key]: value } as Pick<EnrichedPointState, Key>);

  const updateCoordinate = (key: CoordinateKey, value: number) =>
    set((state) => (Object.is(state[key], value) ? state : { [key]: value }));

  return {
    setStep: (value: number) => update("step", value),
    setXCoord: (value: number) => updateCoordinate("xCoord", value),
    setYCoord: (value: number) => updateCoordinate("yCoord", value),
    setLongitude: (value: number) => updateCoordinate("longitude", value),
    setLatitude: (value: number) => updateCoordinate("latitude", value),
    setCoordinateSystem: (value: EnrichedPointState["coordinateSystem"]) =>
      update("coordinateSystem", value),
    setVertrouwelijk: (value: boolean) => update("vertrouwelijk", value),
    setHerhalen: (value: boolean) => update("herhalen", value),
    setOmschrijving: (value: string) => update("omschrijving", value),
    setActiviteit: (value: string) => update("activiteit", value),
    setOrganisatie: (value: string) => update("organisatie", value),
    setSpecifiekLettenOp: (value: string) => update("specifiekLettenOp", value),
    setCurrentPoint: (value: { x: number; y: number }) =>
      update("currentPoint", value),
    setMapClickedNotify: (value: number) => update("mapClickedNotify", value),
    reset: () => set(initialEnrichedPointValues),
  };
}
