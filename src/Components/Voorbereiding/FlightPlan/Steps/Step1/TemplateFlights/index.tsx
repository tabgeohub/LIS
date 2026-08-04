import { useState } from "react";
import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import { useTemplateFlights } from "api-hooks/templateFlights";
import { useCreateData } from "api-hooks/mutations";
import { kaartlagenState } from "Components/HomePage/hooks/kaartlagen/kaartlagenState";
import { useAuth } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";

import Fase1 from "./Fase1";
import Fase2 from "./Fase2";
import Fase3 from "./Fase3";
import { submitCollectedFlightPlanCreate } from "Components/HomePage/hooks/flightPlan/submitCollectedFlightPlanCreate";
import type { Template } from "api-hooks/templateFlights";

export type FlightPlanTemplate = Template;

export default function TemplateFlight({
  basemapString,
}: {
  basemapString: string;
}) {
  const [fase, setFase] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<FlightPlanTemplate | null>(null);

  const { user } = useAuth();
  const { data: flightTemplate } = useTemplateFlights({
    regioId: user.role,
    userId: user.user_id,
  });
  const { create } = useCreateData("/flightPlans");
  const { clearGraphics } = useMapViewState();
  const { selectedLayers } = kaartlagenState();
  const store = useFlightPlanState();
  const { setStep, clear } = store;

  const handleSubmit = (points: number[], geometries?: number[]) => {
    submitCollectedFlightPlanCreate({
      create,
      store,
      pointIds: points,
      geometryIds: geometries,
      geometries: selectedTemplate?.geometries,
      basemap: basemapString,
      layers: selectedLayers,
      userId: user?.user_id,
      regioId: user.role,
      onCleanup: () => {
        clear();
        clearGraphics();
      },
    });
  };

  return (
    <div className="h-full">
      {fase === 1 && <Fase1 setFase={setFase} setStep={setStep} />}

      {fase === 2 && flightTemplate && (
        <Fase2
          setFase={setFase}
          flightTemplate={flightTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      )}

      {fase === 3 && (
        <Fase3
          setFase={setFase}
          selectedTemplate={selectedTemplate}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
