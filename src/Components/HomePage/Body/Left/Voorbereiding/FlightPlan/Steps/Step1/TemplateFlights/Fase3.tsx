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

function collectIds(items: Array<{ id: number }> | null | undefined): number[] {
  return items?.map((item) => item.id) || [];
}

function useTemplateFase3MapPreview(selectedTemplate: {
  points?: Array<{ id: number }>;
  geometries?: Array<{ id: number }>;
}) {
  const templatePoints = selectedTemplate?.points || [];
  const templateGeometries = selectedTemplate?.geometries || [];
  const pointIds = collectIds(templatePoints);
  const geometryIds = collectIds(templateGeometries);

  useDrawYellowMarkers({
    selectedPointIds: pointIds,
    points: templatePoints,
  });
  useDrawYellowGeometries({
    selectedGeometryIds: geometryIds,
    geometries: [],
    allGeometries: templateGeometries,
  });

  return { templatePoints, templateGeometries, pointIds, geometryIds };
}

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
  const { templatePoints, templateGeometries, pointIds, geometryIds } =
    useTemplateFase3MapPreview(selectedTemplate);

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
      {templatePoints.map((point: any, index: number) => (
        <TemplatePointRow
          key={`point-${index}`}
          point={point}
          onEnter={() => handleHoveredPoint(point)}
          onLeave={handleRemoveHoverePoint}
        />
      ))}
      {templateGeometries.map((geometry: any, index: number) => (
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
