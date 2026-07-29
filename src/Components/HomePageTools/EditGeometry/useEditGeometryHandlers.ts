import {
  makeDeleteClickHandler,
  makeDeleteHandler,
  makeEditClickHandler,
  makeEditSaveHandler,
  makePointUpdatedHandler,
} from "./editGeometryHandlerFactories";
import type { useEditGeometryModel } from "./useEditGeometryModel";

type Model = ReturnType<typeof useEditGeometryModel>;

export function useEditGeometryHandlers(m: Model) {
  return {
    handleEditClick: makeEditClickHandler(m),
    handleEditSave: makeEditSaveHandler(m),
    handlePointUpdated: makePointUpdatedHandler(m),
    handleDelete: makeDeleteHandler(m),
    handleDeleteClick: makeDeleteClickHandler(m),
  };
}
