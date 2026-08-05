/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTemplateFlightState } from "./templateFlightStates";
import Filter from "./Steps/Filter";
import { usePointsStore } from "hooks/features";
import { EnrichedPointType } from "Types";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

function herhalenForStep(step: number): number | null {
  if (step === 2) return 1;
  if (step === 3) return 0;
  return null;
}

export default function TemplateFlight() {
  const { step } = useTemplateFlightState();
  const [name, setName] = useState("");
  const { points, setPoints, dbPoints } = usePointsStore();

  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (step === 1) return;

    const herhalenValue = herhalenForStep(step);
    if (herhalenValue == null) return;

    const next = dbPoints.filter((point) => point.herhalen === herhalenValue);
    setPoints(next);
    setFilteredPoints(next);
  }, [step]);

  if (openFilter) {
    return (
      <div className="h-full">
        <Filter
          setFilteredPoints={setFilteredPoints}
          herhalen={true}
          setOpenFilter={setOpenFilter}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      {renderWizardStep(step, {
        1: <Step1 name={name} setName={setName} />,
        2: (
          <Step2
            setOpenFilter={setOpenFilter}
            filteredPoints={filteredPoints}
          />
        ),
        3: (
          <Step3
            name={name}
            setOpenFilter={setOpenFilter}
            filteredPoints={filteredPoints}
          />
        ),
      })}
    </div>
  );
}
