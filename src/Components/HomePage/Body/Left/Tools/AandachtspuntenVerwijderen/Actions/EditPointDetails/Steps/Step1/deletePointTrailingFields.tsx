import { ReadOnlyPointCoordinates } from "./ReadOnlyPointFields";
import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function deletePointTrailingFields(m: Model) {
  return (
    <ReadOnlyPointCoordinates
      values={{
        x: m.xcoordinaat_rd,
        y: m.ycoordinaat_rd,
        latitude: m.latitude,
        longitude: m.longitude,
        confidential: m.vertrouwelijk === 1,
      }}
      labels={m.labels}
    />
  );
}
