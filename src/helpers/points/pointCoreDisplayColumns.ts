import { POINT_CORE_IDENTITY_KEYS } from "./pointCoreIdentityKeys";

export const POINT_CORE_DISPLAY_COLUMNS = [
  ...POINT_CORE_IDENTITY_KEYS,
  "herhalen",
  "vertrouwelijk",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;
