import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "../../../helpers/useViewPlanState";
import { useUpdateData } from "utils/useUpdateData";
import { useContent } from "hooks/useContent";

export default function Submit({
  omschrijving,
  activiteit,
  organisatie,
  specifiekLettenOp,
}: {
  omschrijving: string;
  activiteit: string;
  organisatie: string;
  specifiekLettenOp: string;
}) {
  const { clickedPoint, setStep, selectedPlan } = useViewPlanState();
  const { pointsTable } = useOpenTable();

  const { update: updatePoint } = useUpdateData(
    `/points/${pointsTable[clickedPoint].id}`
  );

  function handleSubmit() {
    const pointToUpdate = selectedPlan?.points.find(
      (p) => p.id === pointsTable[clickedPoint].id
    );

    if (!pointToUpdate) return;

    updatePoint(
      {
        omschrijving: omschrijving,
        regio_id: pointToUpdate.regio_id,
        xcoordinaat_rd: pointToUpdate.xcoordinaat_rd,
        ycoordinaat_rd: pointToUpdate.ycoordinaat_rd,
        latitude: pointToUpdate.latitude,
        longitude: pointToUpdate.longitude,
        vertrouwelijk: pointToUpdate.vertrouwelijk,
        herhalen: pointToUpdate.herhalen,
        user_id: pointToUpdate.user_id,
        activiteit_id: activiteit,
        organisatie_id: organisatie,
        specifiek_letten_op: specifiekLettenOp,
        id: pointToUpdate.id,
      },
      () => {
        setStep(2);
      }
    );
  }

  const content = useContent();

  return (
    <button className="gray-button" onClick={handleSubmit}>
      {content.common.opslaan}
    </button>
  );
}
