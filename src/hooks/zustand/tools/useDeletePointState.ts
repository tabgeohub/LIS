import { create } from "zustand";
import { createDeletePointState } from "./deletePointStateCore";
import type { DeletePoint } from "./deletePointStateTypes";

export type {
  DeletePointCoordinateFields,
  DeletePointFormFields,
} from "./deletePointFormFields";
export {
  pickDeletePointCoordinateFields,
  pickDeletePointFormFields,
} from "./deletePointFormFields";

export const useDeletePointState = create<DeletePoint>(createDeletePointState);
