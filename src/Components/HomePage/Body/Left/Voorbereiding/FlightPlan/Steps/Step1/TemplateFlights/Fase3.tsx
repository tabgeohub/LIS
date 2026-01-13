/* eslint-disable react-hooks/exhaustive-deps */
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import { useContent } from "hooks/useContent";
import { FaMapPin } from "react-icons/fa6";

export default function Fase3({
  setFase,
  selectedTemplate,
  handleSubmit,
}: {
  setFase: (value: number) => void;
  selectedTemplate: any;
  handleSubmit: (points: number[]) => void;
}) {
  const content = useContent();

  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  useDrawYellowMarkers({
    selectedPointIds: selectedTemplate?.points?.map((p: any) => p.id) || [],
    points: selectedTemplate?.points || [],
  });

  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            className="gray-button"
            onClick={() => {
              setFase(2);
            }}
          >
            {content.common.vorige}
          </button>

          <button
            className="gray-button"
            onClick={() =>
              handleSubmit(selectedTemplate?.points.map((p) => p.id))
            }
          >
            {content.common.opslaan}
          </button>
        </>
      }
      className="p-2 h-full"
    >
      {selectedTemplate?.points.map((point, index) => (
        <div
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
          key={index}
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
    </ScrollButtonsLayout>
  );
}
