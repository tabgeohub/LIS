/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Form from "./Form";
import PointsList from "./PointsList";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useEffect } from "react";
import Point from "@arcgis/core/geometry/Point";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import PointsAdding from "./PointsAdding";

export default function Step2({
  vluchtnummer,
  setVluchtnummer,
  handleCancel,
  refetch,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { mapView, graphicsLayer, graphicsLayerHover } = useMapViewState();
  const { setOpenTable, pointsTable } = useOpenTable();

  const { clickedPoint, setClickedPoint, setStep, selectedPlan } =
    useViewPlanState();
  const { setPoints } = usePointsStore();

  useEffect(() => {
    if (!mapView) return;
    if (!selectedPlan) return;

    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();

    setOpenTable(true);

    mapView?.graphics.removeAll();

    setPoints(selectedPlan.points);
  }, [clickedPoint]);

  const selectTargetPoint = (index: number) => {
    setClickedPoint(index);

    if (mapView) {
      mapView.zoom = 15;

      const pt = new Point({
        longitude: pointsTable[index].longitude,
        latitude: pointsTable[index].latitude,
      });

      mapView.goTo(pt);
    }
  };

  return (
    <ScrollButtonsLayout
      className="h-full"
      buttons={
        <Buttons
          vluchtnummer={vluchtnummer}
          handleCancel={handleCancel}
          refetch={refetch}
        />
      }
    >
      <div className="py-4 px-2 space-y-4">
        <Form vluchtnummer={vluchtnummer} setVluchtnummer={setVluchtnummer} />

        <PointsList
          clickedPoint={clickedPoint}
          selectTargetPoint={selectTargetPoint}
        />
      </div>

      <div className="h-[2px] bg-gray-200 my-4" />

      <PointsAdding setStep={setStep} />
    </ScrollButtonsLayout>
  );
}
