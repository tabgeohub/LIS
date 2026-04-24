/* eslint-disable react-hooks/exhaustive-deps */
import Buttons from "./Buttons";
import { useState } from "react";
import NoneAction from "./Actions/NoneAction";
import EditFlight from "./Actions/EditFlight";
import VliegrouteExporteren from "./Actions/VliegrouteExporteren";
import Waarnemingen from "./Actions/Waarnemingen";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import useDrawPath from "hooks/hover-click-handlers/useDrawPath";
import { useReadData } from "utils/useReadData";
import { FinishedFlightPlanType } from "Types/finished_plans";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useContent } from "hooks/useContent";
import { useRenderPlanPoints } from "../../hooks/useRenderPlanPoints";
import { useRenderPlanGeometries } from "../../hooks/useRenderPlanGeometries";
import { useFilterPlanPoints } from "../../hooks/useFilterPlanPoints";
import { useUpdateSelectedPlan } from "../../hooks/useUpdateSelectedPlan";

export type ActionType =
  | "none"
  | "waarnemingen"
  | "vluchtBewerken"
  | "vliegroute";

export default function Step2() {
  const [action, setAction] = useState<ActionType>("none");

  const { selectedPlan } = useFinishedPlansState();

  const content = useContent();

  const { data: finishedPlan, loading: finishedPlanLoading } = useReadData<FinishedFlightPlanType>(
    "/finished_plans/getSingleFinishedFlightPlan/" + selectedPlan?.id
  );

  const { loadingPath } = useDrawPath(finishedPlanLoading);

  // Filter points to only include those in the selected plan
  useFilterPlanPoints();

  // Update selected plan when finished plan data is fetched
  useUpdateSelectedPlan(finishedPlan);

  // Render plan points and geometries using hooks
  // Always render plan-specific points and geometries in Step2
  useRenderPlanPoints();
  useRenderPlanGeometries();

  return (
    <div className="p-1.5 h-full relative">
      {action === "none" && (
        <>
          <NoneAction />

          <Buttons setAction={setAction} />
        </>
      )}

      {action === "vluchtBewerken" && <EditFlight setAction={setAction} />}

      {action === "waarnemingen" && <Waarnemingen setAction={setAction} />}

      {action === "vliegroute" && (
        <VliegrouteExporteren setAction={setAction} />
      )}

      {loadingPath && (
        <div className="absolute inset-0 z-20 bg-gray-200/80 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-primary font-semibold text-lg animate-pulse text-center">
              {content.nabewerking.vluchtenZoeken.step2.loadingPath}
            </p>
            <LoadingBars />
          </div>
        </div>
      )}
    </div>
  );
}
