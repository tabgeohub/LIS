import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { Geometry } from "hooks/features/useGeometriesStore";
import useGeometryListMapActions from "hooks/hover-click-handlers/useGeometryListMapActions";
import { MdFilterAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { TfiMoreAlt } from "react-icons/tfi";
import { TbPolygon, TbLine } from "react-icons/tb";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

const allColumnsGeometries = [
  "omschrijving",
  "type",
  "regio_id",
  "herhalen",
  "vertrouwelijk",
  "activiteit",
  "organisatie",
  "specifiek_letten_op",
  "points_count",
];

export default function GeometriesTable({
  starredGeometries,
  setStarredGeometries,
  handleDragStart,
  handleDragOver,
  handleDrop,
  removeColumn,
  containerHeight,
  containerWidth,
}: any) {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const { geometriesTable } = useOpenTable();

  const [visibleColumnsGeometries, setVisibleColumnsGeometries] =
    useState(allColumnsGeometries);

  const { hoverGeometry, clearHover, goToGeometry, toggleStarGeometry } =
    useGeometryListMapActions({
      starredGeometries,
      setStarredGeometries,
    });

  return (
    <div
      className="w-max min-w-full"
      style={{
        minHeight:
          typeof containerHeight === "number"
            ? `${containerHeight}px`
            : undefined,
      }}
    >
      <table className="min-w-max text-[11px] text-left rtl:text-right text-gray-500 border-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <thead className="text-[12px] sticky top-0 bg-white z-10">
          <tr>
            <th className="px-2 py-2">
              <MdFilterAlt className="text-gray-500 text-xl" />
            </th>

            {visibleColumnsGeometries.map((col: string) => (
              <th
                key={col}
                className="px-2 py-2 cursor-move whitespace-nowrap"
                draggable
                onDragStart={() => handleDragStart(col)}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(
                    col,
                    visibleColumnsGeometries,
                    setVisibleColumnsGeometries
                  )
                }
              >
                <div className="flex justify-between items-center gap-1">
                  <button title="Drag column">
                    <RxDragHandleDots2 />
                  </button>
                  <span>{col}</span>
                  <button
                    onClick={() =>
                      removeColumn(col, setVisibleColumnsGeometries)
                    }
                  >
                    <IoClose />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {geometriesTable.map((geometry: Geometry, index: number) => {
            const isStarred = starredGeometries.some(
              (g: Geometry) => g.id === geometry.id
            );
            // Get first point data
            const firstPoint = geometry.points && geometry.points.length > 0 ? geometry.points[0] : null;
            
            return (
              <tr
                key={geometry.id}
                className={`relative px-2 py-6 ${
                  isStarred
                    ? "bg-blue-100"
                    : index % 2 === 0
                    ? "bg-white hover:bg-gray-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onMouseEnter={() => hoverGeometry(geometry)}
                onMouseLeave={clearHover}
                onClick={() => goToGeometry(geometry)}
              >
                <td className="px-2 py-1 align-middle">
                  <div className="flex items-center gap-1 leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarGeometry(geometry);
                      }}
                      className="p-0.5"
                    >
                      <FaStar
                        className={`block h-4 w-4 shrink-0 ${
                          isStarred ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Geometry popup functionality not yet implemented */}
                    <button
                      type="button"
                      className="p-0.5 opacity-50 cursor-not-allowed"
                      disabled
                      title="Geometry actions coming soon"
                    >
                      <TfiMoreAlt className="block h-4 w-4 shrink-0" />
                    </button>
                  </div>
                </td>

                {visibleColumnsGeometries.map((col: string) => (
                  <td key={col} className="px-2 py-4 whitespace-nowrap">
                    {col === "type" ? (
                      <div className="flex items-center gap-1">
                        {geometry.type === "polygon" ? (
                          <TbPolygon className="text-yellow-500" />
                        ) : (
                          <TbLine className="text-green-500" />
                        )}
                        <span>{geometry.type}</span>
                      </div>
                    ) : col === "activiteit" ? (
                      firstPoint && (firstPoint as any).activiteit_id
                        ? activities.find((a) => a.value === (firstPoint as any).activiteit_id)?.label || (firstPoint as any).activiteit_id
                        : geometry.activiteit
                        ? activities.find((a) => a.value === geometry.activiteit)?.label || geometry.activiteit
                        : ""
                    ) : col === "organisatie" ? (
                      firstPoint && (firstPoint as any).organisatie_id
                        ? organizations.find((o) => o.value === (firstPoint as any).organisatie_id)?.label || (firstPoint as any).organisatie_id
                        : geometry.organisatie
                        ? organizations.find((o) => o.value === geometry.organisatie)?.label || geometry.organisatie
                        : ""
                    ) : col === "points_count" ? (
                      geometry.points?.length || 0
                    ) : col === "herhalen" ? (
                      firstPoint && (firstPoint as any).herhalen !== undefined
                        ? typeof (firstPoint as any).herhalen === "number"
                          ? (firstPoint as any).herhalen === 1
                            ? "Ja"
                            : "Nee"
                          : (firstPoint as any).herhalen === true
                          ? "Ja"
                          : "Nee"
                        : typeof geometry.herhalen === "number"
                        ? geometry.herhalen === 1
                          ? "Ja"
                          : "Nee"
                        : geometry.herhalen === true
                        ? "Ja"
                        : "Nee"
                    ) : col === "vertrouwelijk" ? (
                      firstPoint && (firstPoint as any).vertrouwelijk !== undefined
                        ? typeof (firstPoint as any).vertrouwelijk === "number"
                          ? (firstPoint as any).vertrouwelijk === 1
                            ? "Ja"
                            : "Nee"
                          : (firstPoint as any).vertrouwelijk === true
                          ? "Ja"
                          : "Nee"
                        : typeof geometry.vertrouwelijk === "number"
                        ? geometry.vertrouwelijk === 1
                          ? "Ja"
                          : "Nee"
                        : geometry.vertrouwelijk === true
                        ? "Ja"
                        : "Nee"
                    ) : col === "regio_id" ? (
                      firstPoint && (firstPoint as any).regio_id
                        ? (firstPoint as any).regio_id
                        : geometry.regio_id || ""
                    ) : col === "specifiek_letten_op" ? (
                      firstPoint && (firstPoint as any).specifiek_letten_op
                        ? (firstPoint as any).specifiek_letten_op
                        : geometry.specifiek_letten_op || ""
                    ) : col === "omschrijving" ? (
                      geometry.omschrijving || ""
                    ) : (
                      // For any other column, try first point first, then geometry
                      (firstPoint && (firstPoint as any)[col]) || (geometry[col as keyof Geometry] as any) || ""
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

