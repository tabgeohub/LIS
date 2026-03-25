import { FaMapPin } from "react-icons/fa";
import type { GeometryPointRow } from "./helpers/pointTypes";

export default function EditGeometryPointsList({
  points,
  onEditPoint,
  onVertexHover,
}: {
  points: GeometryPointRow[];
  onEditPoint: (pointId: number) => void;
  onVertexHover?: (pointId: number | null) => void;
}) {
  if (points.length === 0) {
    return (
      <div className="overflow-y-auto flex-1 thin-scrollbar pb-24 px-1">
        <p className="text-[12px] text-gray-500 py-4">
          Deze geometrie heeft geen punten.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 thin-scrollbar pb-24 px-1">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-[13px] font-semibold text-gray-800">Punten</p>
        <p className="text-[10px] text-gray-500">
          Kies een punt om coördinaten en omschrijving aan te passen.
        </p>
      </div>

      <ul className="divide-y divide-gray-100 border border-gray-100 rounded-md">
        {points.map((p, index) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onEditPoint(p.id)}
              onMouseEnter={() => onVertexHover?.(p.id)}
              onMouseLeave={() => onVertexHover?.(null)}
              className="w-full text-left px-2 py-2.5 hover:bg-gray-50 flex items-start gap-2 transition-colors"
            >
              <FaMapPin className="size-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-gray-800 truncate">
                  {p.omschrijving?.trim() || `Punt ${index + 1}`}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  ID {p.id}
                  {typeof p.latitude === "number" &&
                    typeof p.longitude === "number" &&
                    Number.isFinite(p.latitude) &&
                    Number.isFinite(p.longitude) && (
                      <>
                        {" "}
                        · WGS84 {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                      </>
                    )}
                </p>
              </div>
              <span className="text-[11px] text-blue-600 shrink-0 underline">
                Bewerken
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
