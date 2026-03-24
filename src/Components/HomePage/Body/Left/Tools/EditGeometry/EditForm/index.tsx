import { useEffect, useState } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import { useContent } from "hooks/useContent";
import EditFormBody from "./EditFormBody";
import EditFormFooter from "./EditFormFooter";
import { geometryToDraft, type GeometryEditDraft } from "./types";

export type { GeometryEditDraft };

export default function EditForm({
  geometry,
  onCancel,
  onSave,
}: {
  geometry: Geometry;
  onCancel: () => void;
  onSave?: (draft: GeometryEditDraft) => void;
}) {
  const content = useContent();
  const [draft, setDraft] = useState<GeometryEditDraft>(() =>
    geometryToDraft(geometry)
  );

  useEffect(() => {
    setDraft(geometryToDraft(geometry));
  }, [geometry.id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.(draft);
  }

  return (
    <div className="flex flex-col h-[75%]">
      <form
        id="edit-geometry-form"
        onSubmit={handleSubmit}
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
        />
      </form>
    </div>
  );
}
