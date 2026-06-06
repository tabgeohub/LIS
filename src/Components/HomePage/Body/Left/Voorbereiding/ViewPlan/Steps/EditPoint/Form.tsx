import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

export default function Form({
  omschrijving,
  herhalen,
  activiteit,
  organisatie,
  specifiekLettenOp,
  regio_id,
  vertrouwelijk,
  user_id,
  setRegioId,
  setVertrouwelijk,
  setUser_id,
  setHerhalen,
  setOmschrijving,
  setActiviteit,
  setOrganisatie,
  setSpecifiekLettenOp,
}: {
  omschrijving: string;
  herhalen: boolean;
  activiteit: string;
  organisatie: string;
  specifiekLettenOp: string;
  regio_id: string;
  vertrouwelijk: number;
  user_id: number;
  setHerhalen: (value: boolean) => void;
  setOmschrijving: (value: string) => void;
  setActiviteit: (value: string) => void;
  setOrganisatie: (value: string) => void;
  setSpecifiekLettenOp: (value: string) => void;
  setRegioId: (value: string) => void;
  setVertrouwelijk: (value: number) => void;
  setUser_id: (value: number) => void;
}) {
  const { clickedPoint } = useViewPlanState();
  const { pointsTable } = useOpenTable();

  const organizations = useGetOrganisaties();

  const activities = useGetActiviteiten();

  return (
    <div className="py-4 px-2 space-y-4 max-h-[87%] overflow-y-scroll thin-scrollbar">
      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label="Herhalen"
      />
      <InputComp
        label="Omschrijving"
        value={omschrijving}
        setValue={setOmschrijving}
      />
      <InputComp
        label="Datum"
        value={pointsTable[clickedPoint].datum}
        setValue={() => {}}
        disabled={true}
      />

      <InputCompNum
        label="Indiener"
        value={user_id}
        setValue={setUser_id}
        disabled={true}
      />
      <InputComp
        label="Regio"
        value={regio_id}
        setValue={setRegioId}
        disabled={true}
      />
      <InputCompNum
        label="Vertrouwelijk"
        value={vertrouwelijk}
        setValue={setVertrouwelijk}
        disabled={true}
      />
      <SelectComp
        label="Activiteit"
        value={activiteit}
        setValue={setActiviteit}
        required={true}
        options={activities}
      />
      <SelectComp
        label="Organisatie"
        value={organisatie}
        setValue={setOrganisatie}
        required={true}
        options={organizations}
      />
      <InputComp
        label="Specifiek letten op"
        value={specifiekLettenOp}
        setValue={setSpecifiekLettenOp}
      />
      <InputComp
        label="RD (X, Y)"
        value={`(${pointsTable[clickedPoint].xcoordinaat_rd}, ${pointsTable[clickedPoint].ycoordinaat_rd})`}
        setValue={() => {}}
        disabled={true}
      />
    </div>
  );
}
