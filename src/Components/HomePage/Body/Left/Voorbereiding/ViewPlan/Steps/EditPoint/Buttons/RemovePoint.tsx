import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import { useViewPlanState } from "../../../helpers/useViewPlanState";
import { useContent } from "hooks/useContent";

export default function RemovePoint() {
  const { clickedPoint, setStep, selectedPlan, setSelectedPlan } =
    useViewPlanState();

  const { pointsTable, setPointsTable, geometriesTable, setGeometriesTable } = useOpenTable();
  const { setPoints } = usePointsStore();
  const { pointsGraphicsLayer, yellowGraphicsLayer } = useMapViewState();

  const { update: updatePlans } = useUpdateData(`/flightPlans/vluchtplans`);

  const removePoint = (idToRemove: string) => {
    if (selectedPlan) {
      const pointToUpdate = selectedPlan?.points.find(
        (p) => p.id === pointsTable[clickedPoint].id
      );

      if (!pointToUpdate) return;

      const attributes = {
        vluchtnummer: selectedPlan.vluchtnummer,
        omschrijving: selectedPlan.omschrijving,
        waarnemer: selectedPlan.waarnemer,
        piloot: selectedPlan.piloot,
        datum: selectedPlan.datum,
        vliegduur: selectedPlan.vliegduur,
        luchtvaartuig: selectedPlan.luchtvaartuig,
        passagiers: selectedPlan.passagiers,
        hoofdthema: selectedPlan.hoofdthema,
        aanvullende: selectedPlan.aanvullende,
        points: selectedPlan.points
          .filter((point) => point.id !== pointToUpdate.id)
          .flatMap((point) => point.id),
        user_id: selectedPlan.user_id,
        status: selectedPlan.status,
        id: selectedPlan.id,
      };

      updatePlans(attributes, (responseData) => {
        pointsGraphicsLayer?.removeAll();
        yellowGraphicsLayer?.removeAll();

        setSelectedPlan({
          ...selectedPlan,
          omschrijving: responseData.result.omschrijving,
          waarnemer: responseData.result.waarnemer,
          piloot: responseData.result.piloot,
          datum: responseData.result.datum,
          vliegduur: responseData.result.vliegduur,
          luchtvaartuig: responseData.result.luchtvaartuig,
          passagiers: responseData.result.passagiers,
          hoofdthema: responseData.result.hoofdthema,
          aanvullende: responseData.result.aanvullende,
          points: selectedPlan.points.filter(
            (point) => point.id !== pointToUpdate.id
          ),
          pointsObjects: selectedPlan.points.filter(
            (point) => point.id !== pointToUpdate.id
          ),
        });

        setStep(2);

        setPointsTable(
          pointsTable.filter((point) => {
            return point.id !== parseFloat(idToRemove);
          })
        );
        // Preserve geometries when removing a point
        setGeometriesTable(geometriesTable);

        setPoints(
          selectedPlan.points.filter((point) => point.id !== pointToUpdate.id)
        );

        setPoints(
          selectedPlan.points.filter((point) => point.id !== pointToUpdate.id)
        );

        const blueSymbol = new SimpleMarkerSymbol({
          color: "blue",
          size: 12,
          style: "circle",
          outline: {
            color: "white",
            width: 1,
          },
        });

        const graphics = selectedPlan.points
          .filter((point) => point.id !== pointToUpdate.id)
          .map((point) => {
            const geometry = new Point({
              x: point.longitude,
              y: point.latitude,
            });

            return new Graphic({
              geometry,
              symbol: blueSymbol,
              attributes: point,
            });
          });

        pointsGraphicsLayer?.addMany(graphics);
      });
    }
  };

  const content = useContent();

  return (
    <button
      onClick={() => removePoint(pointsTable[clickedPoint].id.toString())}
      className="gray-button"
    >
      {content.voorbereiding.vluchtplanInformatie.editPointStep.ontkoppelen}
    </button>
  );
}
