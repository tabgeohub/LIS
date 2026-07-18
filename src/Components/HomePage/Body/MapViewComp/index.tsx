import { MapViewCompView } from "./MapViewCompView";
import {
  useMapViewCompModel,
  type MapViewCompProps,
} from "./useMapViewCompModel";

export default function MapViewComp(props: MapViewCompProps) {
  return <MapViewCompView {...useMapViewCompModel(props)} />;
}
