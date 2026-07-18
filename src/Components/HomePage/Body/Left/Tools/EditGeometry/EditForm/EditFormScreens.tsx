import { IoIosArrowBack } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import { useContent } from "hooks/useContent";
import EditFormBody from "./EditFormBody";
import EditFormFooter from "./EditFormFooter";
import EditGeometryPointsList from "./EditGeometryPointsList";
import EditGeometryPointPanel from "./EditGeometryPointPanel";
import FormFooterBar from "./FormFooterBar";
import type { GeometryEditDraft } from "./helpers/types";
import type { GeometryPointRow } from "./helpers/pointTypes";
import type { PointFormState } from "./helpers/pointForm";

export function EditFormMetadataScreen(props: {
  geometry: Geometry;
  draft: GeometryEditDraft;
  setDraft: Dispatch<SetStateAction<GeometryEditDraft>>;
  onCancel: () => void;
  onSave?: (draft: GeometryEditDraft, points?: GeometryPointRow[]) => void;
  pointsDraft: GeometryPointRow[];
  openPointsEditor: () => void;
  isSavingMetadata: boolean;
}) {
  const content = useContent();
  return (
    <form
      id="edit-geometry-form"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSave?.(props.draft, props.pointsDraft);
      }}
      className="flex flex-col flex-1 min-h-0 p-2"
    >
      <EditFormBody
        geometry={props.geometry}
        draft={props.draft}
        setDraft={props.setDraft}
      />
      <EditFormFooter
        onCancel={props.onCancel}
        annulerenLabel={content.common.annuleren}
        opslaanLabel={content.common.opslaan}
        openPointsEditor={props.openPointsEditor}
        isSaving={props.isSavingMetadata}
      />
    </form>
  );
}

export function EditFormPointsListScreen(props: {
  pointsDraft: GeometryPointRow[];
  openPointEdit: (pointId: number) => void;
  setHoveredVertexId: (id: number | null) => void;
  backToMetadata: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 p-2 relative">
      <EditGeometryPointsList
        points={props.pointsDraft}
        onEditPoint={props.openPointEdit}
        onVertexHover={props.setHoveredVertexId}
      />
      <FormFooterBar>
        <button
          type="button"
          onClick={props.backToMetadata}
          className="gray-button inline-flex items-center gap-1.5"
        >
          <IoIosArrowBack className="size-4 shrink-0" aria-hidden />
          Terug naar geometrie
        </button>
      </FormFooterBar>
    </div>
  );
}

export function EditFormPointEditScreen(props: {
  pointForm: PointFormState;
  setPointForm: (form: PointFormState) => void;
  submitPoint: (e: React.FormEvent) => void;
  backToPointsList: () => void;
  isUpdatingPoint: boolean;
}) {
  return (
    <form
      id="edit-point-form"
      onSubmit={props.submitPoint}
      className="flex flex-col flex-1 min-h-0 p-2 relative"
    >
      <EditGeometryPointPanel
        form={props.pointForm}
        onChange={props.setPointForm}
      />
      <FormFooterBar>
        <button
          type="button"
          onClick={props.backToPointsList}
          className="gray-button inline-flex items-center gap-1.5"
        >
          <IoIosArrowBack className="size-4 shrink-0" aria-hidden />
          Terug naar punten
        </button>
        <button type="submit" className="gray-button">
          {props.isUpdatingPoint ? "Updaten..." : "Update punt"}
        </button>
      </FormFooterBar>
    </form>
  );
}
