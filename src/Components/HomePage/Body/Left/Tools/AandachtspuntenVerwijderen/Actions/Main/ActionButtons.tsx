import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { EnrichedPointType } from "Types";

export default function ActionButtons({ point }: { point: EnrichedPointType }) {
  const { setMainStep, setSelectedPoint, setSelectedPoints } =
    useDeletePointState();

  const { mapView, yellowGraphicsLayer, redGraphicsLayer } = useMapViewState();

  const content = useContent();

  return (
    <div className="text-blue-500 text-xs font-medium mt-2.5">
      <span
        onClick={() => {
          setSelectedPoint(point);
          setMainStep("editSelectedPoint");
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all"
      >
        {
          content.tools.aandachtspuntenVerwijderen.pointsList.btns
            .aandachtspuntWijzigen
        }
      </span>

      <span className="mx-2">-</span>

      <span
        onClick={() => {
          setSelectedPoint(point);
          setMainStep("deletePoint");
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all"
      >
        {
          content.tools.aandachtspuntenVerwijderen.pointsList.btns
            .aandachtspuntVerwijderen
        }
      </span>

      <span className="mx-2">-</span>

      <span
        onClick={() => {
          mapView?.graphics.removeAll();
          yellowGraphicsLayer?.removeAll();
          redGraphicsLayer?.removeAll();

          setSelectedPoint(null);
          setSelectedPoints([]);

          setSelectedPoint(point);
          setMainStep("viewPlans");
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all"
      >
        {
          content.tools.aandachtspuntenVerwijderen.pointsList.btns
            .waarnemingenBekijken
        }
      </span>

      <span className="mx-2">-</span>

      <span
        onClick={() => {
          setSelectedPoint(point);
          setMainStep("addToPlan");
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all"
      >
        {
          content.tools.aandachtspuntenVerwijderen.pointsList.btns
            .aandachtspuntToevoegenAanVluchtplan
        }
      </span>
    </div>
  );
}
