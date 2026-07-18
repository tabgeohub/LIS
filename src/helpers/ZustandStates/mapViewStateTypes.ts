import type { MapViewCoreState } from "./mapViewCoreState";
import type { MapViewLayersState } from "./mapViewLayersState";

export type MapViewState = MapViewCoreState & MapViewLayersState;
