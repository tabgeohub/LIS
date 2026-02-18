/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTemplateFlightState } from "./templateFlightStates";
import Filter from "./Steps/Filter";
import { usePointsStore } from "hooks/features/usePointsStore";
import { EnrichedPointType } from "Types";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

export default function TemplateFlight() {
  const { step } = useTemplateFlightState();
  const [name, setName] = useState("");
  const { points, setPoints, dbPoints } = usePointsStore();

  const [filteredPoints, setFilteredPoints] =
    useState<EnrichedPointType[]>(points);

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (step === 1) return;

    const herhalenValue = step === 2 ? 1 : step === 3 ? 0 : null;

    setPoints(dbPoints.filter((point) => point.herhalen === herhalenValue));

    setFilteredPoints(
      dbPoints.filter((point) => point.herhalen === herhalenValue)
    );
  }, [step]);

  return (
    <div className="h-full">
      {!openFilter ? (
        <>
          {step === 1 && <Step1 name={name} setName={setName} />}

          {step === 2 && (
            <Step2
              setOpenFilter={setOpenFilter}
              filteredPoints={filteredPoints}
            />
          )}

          {step === 3 && (
            <Step3
              name={name}
              setOpenFilter={setOpenFilter}
              filteredPoints={filteredPoints}
            />
          )}
        </>
      ) : (
        <Filter
          setFilteredPoints={setFilteredPoints}
          herhalen={true}
          setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  );
}
