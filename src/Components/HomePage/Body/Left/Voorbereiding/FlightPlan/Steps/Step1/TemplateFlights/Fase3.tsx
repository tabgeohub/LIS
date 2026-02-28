/* eslint-disable react-hooks/exhaustive-deps */
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import useDrawYellowGeometries from "hooks/hover-click-handlers/useDrawYellowGeometries";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FaMapPin } from "react-icons/fa6";
import { TbPolygon, TbLine } from "react-icons/tb";

export default function Fase3({
  setFase,
  selectedTemplate,
  handleSubmit,
}: {
  setFase: (value: number) => void;
  selectedTemplate: any;
  handleSubmit: (points: number[], geometries?: number[]) => void;
}) {
  const content = useContent();
  const { clearGraphics } = useMapViewState();

  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();

  useDrawYellowMarkers({
    selectedPointIds: selectedTemplate?.points?.map((p: any) => p.id) || [],
    points: selectedTemplate?.points || [],
  });

  useDrawYellowGeometries({
    selectedGeometryIds: selectedTemplate?.geometries?.map((g: any) => g.id) || [],
    geometries: [],
    allGeometries: selectedTemplate?.geometries || [],
  });

  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            className="gray-button"
            onClick={() => {
              clearGraphics();
              setFase(2);
            }}
          >
            {content.common.vorige}
          </button>

          <button
            className="gray-button"
            onClick={() =>

              handleSubmit(
                selectedTemplate?.points?.map((p: any) => p.id) || [],
                selectedTemplate?.geometries?.map((g: any) => g.id) || []
              )
            }
          >
            {content.common.opslaan}
          </button>
        </>
      }
      className="p-2 h-full"
    >
      {selectedTemplate?.points?.map((point: any, index: number) => (
        <div
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
          key={`point-${index}`}
          className="p-2 hover:bg-blue-100/70"
        >
          <div className="flex gap-x-2 items-center">
            <FaMapPin className="text-primary" />
            <span className="text-gray-800 text-lg">{point.omschrijving}</span>
          </div>

          <div className="pl-6 text-xs font-semibold text-gray-600 flex gap-x-1">
            <p>X : {point.xcoordinaat_rd.toFixed(5)}</p>
            <p> / </p>
            <p>Y : {point.ycoordinaat_rd.toFixed(5)}</p>
          </div>
        </div>
      ))}

      {selectedTemplate?.geometries && selectedTemplate.geometries.length > 0 && (
        <>
          {selectedTemplate.geometries.map((geometry: any, index: number) => {
            const geometryTypeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";
            return (
              <div
                onMouseEnter={() => handleHoveredGeometry(geometry)}
                onMouseLeave={handleRemoveHoveredGeometry}
                key={`geometry-${index}`}
                className="p-2 hover:bg-blue-100/70"
              >
                <div className="flex gap-x-2 items-center">
                  {geometry.type === "polygon" ? (
                    <TbPolygon className="text-yellow-500 text-lg" />
                  ) : (
                    <TbLine className="text-green-500 text-lg" />
                  )}
                  <span className="text-gray-800 text-lg">
                    {geometry.omschrijving || `Geometrie ${geometry.id}`}
                  </span>
                </div>

                <div className="pl-6 text-xs font-semibold text-gray-600">
                  <p>Type: {geometryTypeLabel}</p>
                  {geometry.organisatie && <p>Organisatie: {geometry.organisatie}</p>}
                  {geometry.activiteit && <p>Activiteit: {geometry.activiteit}</p>}
                </div>
              </div>
            );
          })}
        </>
      )}
    </ScrollButtonsLayout>
  );
}
