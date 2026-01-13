import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { useTemplateFlightState } from "../../templateFlightStates";
import useLogAction from "hooks/useLogAction";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Buttons({
  setOpenFilter,
  name,
}: {
  setOpenFilter: (value: boolean) => void;
  name: string;
}) {
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const { yellowGraphicsLayer, clearGraphics } = useMapViewState();

  const { create, loading } = useCreateData("/templateFlight");

  const logAction = useLogAction();
  const { user } = useAuth();

  const {
    selectedPoints2,
    selectedPoints,
    setSelectedPoints2,
    setStep,
    clear,
  } = useTemplateFlightState();

  const handleSubmit = () => {
    const attributes = {
      points: [...selectedPoints, ...selectedPoints2],
      name,
      regio_id: user.role,
    };

    logAction({
      message: "User clicked 'Save' button to save flight template data",
      step: "Third step",
      newData: {
        name: name,
        points: [...selectedPoints, ...selectedPoints2],
      },
    });

    create(attributes, () => {
      clear();
      clearGraphics();
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setStep(2);
          resetFilters();
          setSelectedPoints2([]);

          yellowGraphicsLayer?.graphics.removeAll();
        }}
        className="gray-button"
      >
        Vorige
      </button>

      <button onClick={() => setOpenFilter(true)} className="gray-button">
        Filteren
      </button>

      <button onClick={handleSubmit} className="gray-button">
        Opslaan
      </button>

      <button
        onClick={() => {
          handleCancel();
          resetFilters();
          clear();
        }}
        className="gray-button"
      >
        Annuleren
      </button>

      {loading && (
        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <LoadingBars />
        </div>
      )}
    </>
  );
}
