import { Geometry } from "hooks/features/useGeometriesStore";
import type { GeometryEditDraft } from "./types";
import EditFormHeader from "./EditFormHeader";

export default function EditFormBody({
  geometry,
  draft,
  setDraft,
}: {
  geometry: Geometry;
  draft: GeometryEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<GeometryEditDraft>>;
}) {
  const typeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";
  const pointCount = geometry.points?.length ?? 0;

  return (
    <div className="overflow-y-auto flex-1 thin-scrollbar pb-24 px-1">
      <EditFormHeader geometry={geometry} />

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Type
          </label>
          <p className="text-[12px] text-gray-800 bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
            {typeLabel} ({geometry.type})
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Omschrijving
          </label>
          <input
            type="text"
            value={draft.omschrijving}
            onChange={(e) =>
              setDraft((d) => ({ ...d, omschrijving: e.target.value }))
            }
            className="inputClass w-full !p-1.5 text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Organisatie
          </label>
          <input
            type="text"
            value={draft.organisatie}
            onChange={(e) =>
              setDraft((d) => ({ ...d, organisatie: e.target.value }))
            }
            className="inputClass w-full !p-1.5 text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Activiteit
          </label>
          <input
            type="text"
            value={draft.activiteit}
            onChange={(e) =>
              setDraft((d) => ({ ...d, activiteit: e.target.value }))
            }
            className="inputClass w-full !p-1.5 text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Specifiek letten op
          </label>
          <textarea
            value={draft.specifiek_letten_op}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                specifiek_letten_op: e.target.value,
              }))
            }
            rows={3}
            className="inputClass w-full !p-1.5 text-[12px] resize-y min-h-[4rem]"
          />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-gray-800">
            <input
              type="checkbox"
              checked={draft.vertrouwelijk}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  vertrouwelijk: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            Vertrouwelijk
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-gray-800">
            <input
              type="checkbox"
              checked={draft.herhalen}
              onChange={(e) =>
                setDraft((d) => ({ ...d, herhalen: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            Herhalen
          </label>
        </div>

        {geometry.regio_id != null && (
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
              Regio
            </label>
            <p className="text-[12px] text-gray-600 bg-gray-50 border border-gray-100 rounded px-2 py-1.5">
              {String(geometry.regio_id)}
            </p>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Punten
          </label>
          <p className="text-[12px] text-gray-600">
            {pointCount} punt{pointCount !== 1 ? "en" : ""} (coördinaten
            bewerken volgt met backend)
          </p>
        </div>
      </div>
    </div>
  );
}
