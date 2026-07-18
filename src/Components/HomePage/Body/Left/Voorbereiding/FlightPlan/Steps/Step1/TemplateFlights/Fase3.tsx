/* eslint-disable react-hooks/exhaustive-deps */
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import useGeometryListHover from "hooks/hover-click-handlers/useGeometryListHover";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import useDrawYellowGeometries from "hooks/hover-click-handlers/useDrawYellowGeometries";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  TemplateGeometryRow,
  TemplatePointRow,
} from "./templateFlightRows";

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
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } =
    useGeometryListHover();

  useDrawYellowMarkers({
    selectedPointIds: selectedTemplate?.points?.map((p: any) => p.id) || [],
    points: selectedTemplate?.points || [],
  });
  useDrawYellowGeometries({
    selectedGeometryIds:
      selectedTemplate?.geometries?.map((g: any) => g.id) || [],
    geometries: [],
    allGeometries: selectedTemplate?.geometries || [],
  });

  const pointIds = selectedTemplate?.points?.map((p: any) => p.id) || [];
  const geometryIds =
    selectedTemplate?.geometries?.map((g: any) => g.id) || [];

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
            onClick={() => handleSubmit(pointIds, geometryIds)}
          >
            {content.common.opslaan}
          </button>
        </>
      }
      className="p-2 h-full"
    >
      {selectedTemplate?.points?.map((point: any, index: number) => (
        <TemplatePointRow
          key={`point-${index}`}
          point={point}
          onEnter={() => handleHoveredPoint(point)}
          onLeave={handleRemoveHoverePoint}
        />
      ))}
      {selectedTemplate?.geometries?.length > 0 &&
        selectedTemplate.geometries.map((geometry: any, index: number) => (
          <TemplateGeometryRow
            key={`geometry-${index}`}
            geometry={geometry}
            onEnter={() => handleHoveredGeometry(geometry)}
            onLeave={handleRemoveHoveredGeometry}
          />
        ))}
    </ScrollButtonsLayout>
  );
}
