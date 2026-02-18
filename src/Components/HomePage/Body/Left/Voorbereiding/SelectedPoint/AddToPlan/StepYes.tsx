import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { useState } from "react";
import { LuHexagon } from "react-icons/lu";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
export default function StepYes({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const [subStep, setSubStep] = useState(1);

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPolygonPoints } = usePointsStore();

  return (
    <div className="p-1">
      {subStep === 1 && (
        <>
          <p className="text-[12px] mb-2">
            Teken een gebied om één of meerdere aandachtspunten te selecteren.
          </p>

          <button className="bg-primary/10 group hover:bg-primary p-1 rounded border border-primary/30 transition-all">
            <LuHexagon className="text-primary text-2xl group-hover:text-white transition-all" />
          </button>

          <div className="flex justify-end gap-x-1 text-[12px] mt-6">
            <button
              className="gray-button"
              onClick={() => {
                setStep(1);

                logAction({
                  message: "User clicked 'Back' button",
                  step: "Add to plan - Step yes",
                });
              }}
            >
              Vorige
            </button>

            <button
              onClick={() => {
                setSubStep(2);

                logAction({
                  message: "User clicked 'Next' button",
                  step: "Add to plan - Step yes",
                });
              }}
              className="gray-button"
            >
              Volgende
            </button>

            <button
              onClick={() => {
                setSelectedTab("none");
                setSelectedBottomTab("Kaartlagenlijst");
                yellowGraphicsLayer?.removeAll();
                setPolygonPoints([]);

                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Add to plan - Step yes",
                });
              }}
              className="gray-button"
            >
              Annuleren
            </button>
          </div>
        </>
      )}

      {subStep === 2 && (
        <>
          <div className="text-[12px] mt-2">
            Klik op 'Toevoegen' als u de in de kaart geselecteerde
            aandachtspunten wilt toevoegen aan een vluchtplan. Wanneer u de
            selectie wilt aanpassen, klik dan op 'Annuleren' om terug te gaan
            naar de resultatenlijst.
          </div>
          <div className="flex justify-end gap-x-1 text-[12px] mt-6">
            <button
              onClick={() => {
                setStep(4);

                logAction({
                  message: "User clicked 'Add' button",
                  step: "Add to plan - Step yes",
                });
              }}
              className="gray-button"
            >
              Volgende
            </button>

            <button
              onClick={() => {
                setSelectedTab("none");
                setSelectedBottomTab("Kaartlagenlijst");
                yellowGraphicsLayer?.removeAll();
                setPolygonPoints([]);

                logAction({
                  message: "User clicked 'Cancel' button",
                  step: "Add to plan - Step yes",
                });
              }}
              className="gray-button"
            >
              Annuleren
            </button>
          </div>
        </>
      )}
    </div>
  );
}
