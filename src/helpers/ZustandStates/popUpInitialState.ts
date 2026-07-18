import { EnrichedPointType } from "Types";
import {
  EMPTY_POINT_IDENTITY_FIELDS,
  EMPTY_POINT_NUMERIC_FLAGS,
} from "@helpers/points/emptyPointCoreFields";

export const initialPointState: EnrichedPointType = {
  id: 0,
  ...EMPTY_POINT_IDENTITY_FIELDS,
  ...EMPTY_POINT_NUMERIC_FLAGS,
  user_id: 0,
  activiteit_id: "",
  organisatie_id: "",
  specifiek_letten_op: "",
  datum: "",
  Point_description: "",
  aanmaker: "",
  region: "",
};

export type FeatureLayerAttributes = {
  [key: string]: any;
};
