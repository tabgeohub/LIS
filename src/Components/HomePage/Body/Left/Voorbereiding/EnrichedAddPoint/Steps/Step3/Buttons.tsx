import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import { useCreateData } from "utils/useCreateData";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  handleCancel,
}: {
  handleCancel: () => void;
}) {
  const { redGraphicsLayer } = useMapViewState();
  const { user } = useAuth();
  const { fetchDBPoints, fetchPoints } = usePointsStore();
  const { fetchGeometries } = useGeometriesStore();

  const { create } = useCreateData("/points");

  const logAction = useLogAction();

  const content = useContent();

  const {
    omschrijving,
    activiteit,
    organisatie,
    specifiekLettenOp,
    setStep,
    xCoord,
    yCoord,
    latitude,
    longitude,
    vertrouwelijk,
    herhalen,
    reset,
  } = useEnrichedPointState();

  async function handleSubmit() {
    await create({
      omschrijving: omschrijving,
      regio_id: user?.role,
      xcoordinaat_rd: xCoord,
      ycoordinaat_rd: yCoord,
      latitude: latitude,
      longitude: longitude,
      vertrouwelijk: vertrouwelijk ? 1 : 0,
      herhalen: herhalen ? 1 : 0,
      user_id: user?.user_id,
      activiteit_id: activiteit,
      organisatie_id: organisatie,
      specifiek_letten_op: specifiekLettenOp,
    });

    fetchDBPoints({
      regio: user?.role,
    });

    fetchPoints({
      regio: user?.role,
    });

    fetchGeometries({
      regio: user?.role,
    });

    logAction({
      message: "User clicked 'Save' button to save point data",
      step: "Third step",
      newData: {
        omschrijving: omschrijving,
        activiteit: activiteit,
        organisatie: organisatie,
        specifiekLettenOp: specifiekLettenOp,
      },
    });

    redGraphicsLayer?.removeAll();

    reset();
  }

  function handleBack() {
    redGraphicsLayer?.removeAll();

    reset();
  }
  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button onClick={handleBack} className="gray-button">
        {content.common.vorige}
      </button>

      <button onClick={() => setStep(2)} className="gray-button">
        {content.common.update}
      </button>

      <button
        disabled={omschrijving === "" || organisatie === ""}
        onClick={handleSubmit}
        className="gray-button"
      >
        {content.common.opslaan}
      </button>

      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </div>
  );
}
