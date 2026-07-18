import { POINT_CORE_IDENTITY_KEYS } from "./pointCoreIdentityKeys";

export const POINT_EXPORT_COLUMNS = [
  "geometry",
  ...POINT_CORE_IDENTITY_KEYS,
  "herhalen",
  "vertrouwelijk",
  "indiener_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;
