import type { PointCorePayloadFields } from "Types/pointCoreFields";

export type PointImportRow = Omit<PointCorePayloadFields, "user_id"> & {
  user_id: string;
};
