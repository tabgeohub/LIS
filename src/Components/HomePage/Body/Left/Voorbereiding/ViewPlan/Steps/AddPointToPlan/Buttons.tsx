import { useContent } from "hooks/useContent";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";

export default function Buttons({
  selectedPointIds,
  update,
}: {
  selectedPointIds: number[];
  update: any;
}) {
  const content = useContent();

  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  } = useViewPlanState();

  const { dbPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable } = useOpenTable();

  const logAction = useLogAction();

  function handleSubmit() {
    if (!selectedPlan) return;

    const checkedPoints = dbPoints.filter((p) =>
      selectedPointIds.includes(p.id)
    );

    const mergedPointsIds = [
      ...(selectedPlan.points.flatMap((p) => p.id) || []),
      ...selectedPointIds,
    ];

    const uniqueIds = Array.from(new Set(mergedPointsIds));

    update(
      {
        points: uniqueIds,
        id: selectedPlan?.id,
      },
      () => {
        const updatedPoints = dbPoints.filter((p) => uniqueIds.includes(p.id));

        setSelectedPlan({
          ...selectedPlan,
          points: updatedPoints,
          pointsObjects: updatedPoints,
        });

        setPointsTable(updatedPoints);
        setGeometriesTable(selectedPlan.geometries || []);

        // Add yellow points to the map from checkedPoints array
        checkedPoints?.forEach((selectedPoint) => {
          const yellow = new SimpleMarkerSymbol({
            color: "yellow",
            size: 12,
            style: "circle",
            outline: {
              color: "white",
              width: 1,
            },
          });

          // Prefer WGS84 if available; otherwise convert RD -> WGS84
          let lon: number | undefined = (selectedPoint as any).longitude;
          let lat: number | undefined = (selectedPoint as any).latitude;
          if (
            (typeof lon !== "number" || typeof lat !== "number") &&
            typeof (selectedPoint as any).xcoordinaat_rd === "number" &&
            typeof (selectedPoint as any).ycoordinaat_rd === "number"
          ) {
            const wgs = getTransformedCoordinates(
              "RD",
              "WGS84",
              (selectedPoint as any).xcoordinaat_rd,
              (selectedPoint as any).ycoordinaat_rd
            );
            lon = wgs.x;
            lat = wgs.y;
          }

          if (typeof lon !== "number" || typeof lat !== "number") return;

          const geometry = new Point({
            longitude: lon,
            latitude: lat,
            spatialReference: { wkid: 4326 },
          });

          const graphic = new Graphic({
            geometry,
            symbol: yellow,
            attributes: selectedPoint,
          });

          yellowGraphicsLayer?.add(graphic);
        });

        // Update only plan with id === selectedPlan?.id inside filteredPlans
        setFilteredPlans(
          filteredPlans.map((p) => ({
            ...p,
            points: p.id === selectedPlan?.id ? updatedPoints : p.points,
            pointsObjects:
              p.id === selectedPlan?.id ? updatedPoints : p.pointsObjects,
          }))
        );

        setStep(2);
      }
    );
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px]">
      <button
        onClick={() => {
          setStep(2);

          logAction({
            message: "User clicked 'Next' button",
            step: "Third step",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button onClick={handleSubmit} className="gray-button">
        {content.common.opslaan}
      </button>
    </div>
  );
}
