import { Geometry } from "hooks/features/useGeometriesStore";
import type { GeometryEditDraft } from "./helpers/types";
import {
  geometryTypeDutchLabel,
  selectOptionsWithFallback,
} from "./helpers/labels";
import EditFormHeader from "./EditFormHeader";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

export default function EditFormBody({
  geometry,
  draft,
  setDraft,
}: {
  geometry: Geometry;
  draft: GeometryEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<GeometryEditDraft>>;
}) {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const activiteitOptions = selectOptionsWithFallback(
    activities,
    draft.activiteit
  );
  const organisatieOptions = selectOptionsWithFallback(
    organizations,
    draft.organisatie
  );

  const typeLabel = geometryTypeDutchLabel(geometry.type);
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
          <select
            value={draft.organisatie}
            onChange={(e) =>
              setDraft((d) => ({ ...d, organisatie: e.target.value }))
            }
            className={`inputClass w-full !p-1.5 text-[12px] ${
              draft.organisatie ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            {organisatieOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Activiteit
          </label>
          <select
            value={draft.activiteit}
            onChange={(e) =>
              setDraft((d) => ({ ...d, activiteit: e.target.value }))
            }
            className={`inputClass w-full !p-1.5 text-[12px] ${
              draft.activiteit ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            {activiteitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            {pointCount} punt{pointCount !== 1 ? "en" : ""}. Gebruik onderaan{" "}
            <span className="font-medium">Punten bewerken</span> om coördinaten
            per punt aan te passen.
          </p>
        </div>
      </div>
    </div>
  );
}
