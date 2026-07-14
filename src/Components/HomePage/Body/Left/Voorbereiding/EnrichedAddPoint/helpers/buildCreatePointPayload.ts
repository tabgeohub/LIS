import type { UserType } from "Types";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";

type EnrichedPointState = ReturnType<typeof useEnrichedPointState.getState>;

export function buildCreatePointPayload(input: {
  point: EnrichedPointState;
  user: UserType;
}) {
  return {
    omschrijving: input.point.omschrijving,
    regio_id: input.user.role,
    xcoordinaat_rd: input.point.xCoord,
    ycoordinaat_rd: input.point.yCoord,
    latitude: input.point.latitude,
    longitude: input.point.longitude,
    vertrouwelijk: input.point.vertrouwelijk ? 1 : 0,
    herhalen: input.point.herhalen ? 1 : 0,
    user_id: input.user.user_id,
    activiteit_id: input.point.activiteit,
    organisatie_id: input.point.organisatie,
    specifiek_letten_op: input.point.specifiekLettenOp,
  };
}
