import type { ClickableGeometry } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryMapGraphics";

type SingleGeometryClickOptions = {
  selectedGeometry: ClickableGeometry | null;
  selectedGeometryIds?: never;
  allGeometries?: never;
  herhalenFilter?: never;
};
type MultiGeometryClickOptions = {
  selectedGeometry?: never;
  selectedGeometryIds: number[];
  allGeometries: ClickableGeometry[];
  herhalenFilter?: boolean | null;
};
export type UseGeometryClickOptions = SingleGeometryClickOptions | MultiGeometryClickOptions;
export const isMultiGeometryMode = (
  options: UseGeometryClickOptions
): options is MultiGeometryClickOptions => options.selectedGeometryIds !== undefined;
