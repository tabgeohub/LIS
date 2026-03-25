import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Geometry } from "hooks/features/useGeometriesStore";
import { useContent } from "hooks/useContent";
import EditFormBody from "./EditFormBody";
import EditFormFooter from "./EditFormFooter";
import EditGeometryPointsList from "./EditGeometryPointsList";
import EditGeometryPointPanel from "./EditGeometryPointPanel";
import FormFooterBar from "./FormFooterBar";
import { geometryToDraft, type GeometryEditDraft } from "./helpers/types";
import { cloneGeometryPoints, type GeometryPointRow } from "./helpers/pointTypes";
import {
  formToPointRow,
  pointToForm,
  type PointFormState,
} from "./helpers/pointForm";
import useEditGeometryVerticesOnMap from "hooks/hover-click-handlers/useEditGeometryVerticesOnMap";

export type { GeometryEditDraft };
export type { GeometryPointRow } from "./helpers/pointTypes";

type Screen = "metadata" | "pointsList" | "pointEdit";

export default function EditForm({
  geometry,
  onCancel,
  onSave,
}: {
  geometry: Geometry;
  onCancel: () => void;
  onSave?: (draft: GeometryEditDraft, points?: GeometryPointRow[]) => void;
}) {
  const content = useContent();
  const [draft, setDraft] = useState<GeometryEditDraft>(() =>
    geometryToDraft(geometry)
  );
  const [screen, setScreen] = useState<Screen>("metadata");
  const [pointsDraft, setPointsDraft] = useState<GeometryPointRow[]>(() =>
    cloneGeometryPoints(geometry.points)
  );
  const [pointForm, setPointForm] = useState<PointFormState | null>(null);
  const [hoveredVertexId, setHoveredVertexId] = useState<number | null>(null);
  const [selectedVertexId, setSelectedVertexId] = useState<number | null>(
    null
  );

  const showVerticesOnMap = screen === "pointsList" || screen === "pointEdit";

  useEditGeometryVerticesOnMap({
    showVertices: showVerticesOnMap,
    points: pointsDraft,
    hoveredPointId: hoveredVertexId,
    selectedPointId: selectedVertexId,
  });

  useEffect(() => {
    setDraft(geometryToDraft(geometry));
    setPointsDraft(cloneGeometryPoints(geometry.points));
    setScreen("metadata");
    setPointForm(null);
    setHoveredVertexId(null);
    setSelectedVertexId(null);
  }, [geometry.id]);

  useEffect(() => {
    if (screen === "metadata") {
      setHoveredVertexId(null);
      setSelectedVertexId(null);
    }
  }, [screen]);

  function handleSubmitMetadata(e: React.FormEvent) {
    e.preventDefault();
    onSave?.(draft, pointsDraft);
  }

  function openPointsEditor() {
    setScreen("pointsList");
  }

  function backToMetadata() {
    setScreen("metadata");
    setPointForm(null);
    setHoveredVertexId(null);
    setSelectedVertexId(null);
  }

  function openPointEdit(pointId: number) {
    const p = pointsDraft.find((x) => x.id === pointId);
    if (!p) return;
    setHoveredVertexId(null);
    setSelectedVertexId(pointId);
    setPointForm(pointToForm(p));
    setScreen("pointEdit");
  }

  function backToPointsList() {
    setHoveredVertexId(null);
    setScreen("pointsList");
    setPointForm(null);
    // keep selected highlight while user is in pointEdit / pointsList
  }

  function handleSubmitPoint(e: React.FormEvent) {
    e.preventDefault();
    if (pointForm == null) return;
    const base = pointsDraft.find((p) => p.id === pointForm.id);
    if (!base) return;
    const updated = formToPointRow(base, pointForm);
    setPointsDraft((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    backToPointsList();
  }



  return (
    <div className="flex flex-col h-[90%]">
      {screen === "metadata" && (
        <form
          id="edit-geometry-form"
          onSubmit={handleSubmitMetadata}
          className="flex flex-col flex-1 min-h-0 p-2"
        >
          <EditFormBody
            geometry={geometry}
            draft={draft}
            setDraft={setDraft}
          />

          <EditFormFooter
            onCancel={onCancel}
            annulerenLabel={content.common.annuleren}
            opslaanLabel={content.common.opslaan}
            openPointsEditor={openPointsEditor}
          />
        </form>
      )}

      {screen === "pointsList" && (
        <div className="flex flex-col flex-1 min-h-0 p-2 relative">
          <EditGeometryPointsList
            points={pointsDraft}
            onEditPoint={openPointEdit}
            onVertexHover={setHoveredVertexId}
          />

          <FormFooterBar>
            <button
              type="button"
              onClick={backToMetadata}
              className="gray-button inline-flex items-center gap-1.5"
            >
              <IoIosArrowBack className="size-4 shrink-0" aria-hidden />
              Terug naar geometrie
            </button>
          </FormFooterBar>
        </div>
      )}

      {screen === "pointEdit" && pointForm && (
        <form
          id="edit-point-form"
          onSubmit={handleSubmitPoint}
          className="flex flex-col flex-1 min-h-0 p-2 relative"
        >
          <EditGeometryPointPanel form={pointForm} onChange={setPointForm} />
          <FormFooterBar>
            <button
              type="button"
              onClick={backToPointsList}
              className="gray-button inline-flex items-center gap-1.5"
            >
              <IoIosArrowBack className="size-4 shrink-0" aria-hidden />
              Terug naar punten
            </button>
            <button type="submit" className="gray-button">
              Punt opslaan
            </button>
          </FormFooterBar>
        </form>
      )}
    </div>
  );
}
