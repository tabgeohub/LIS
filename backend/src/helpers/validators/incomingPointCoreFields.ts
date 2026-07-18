import { PointCoreColumn } from "../queries/points/pointCoreColumns";

type PointCoreNumericColumn =
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude"
  | "vertrouwelijk"
  | "herhalen"
  | "user_id";

type OptionalIncomingPointCore = {
  [K in Exclude<PointCoreColumn, "omschrijving">]?: K extends PointCoreNumericColumn
    ? number
    : string;
};

/** Core point fields accepted on finished-plan payloads. */
export type IncomingPointCoreFields = {
  omschrijving: string;
} & OptionalIncomingPointCore;
