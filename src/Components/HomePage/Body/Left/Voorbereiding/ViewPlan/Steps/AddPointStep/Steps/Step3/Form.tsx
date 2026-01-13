import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

export default function Form() {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const {
    vertrouwelijk,
    setVertrouwelijk,
    herhalen,
    setHerhalen,
    omschrijving,
    setOmschrijving,
    activiteit,
    setActiviteit,
    organisatie,
    setOrganisatie,
    specifiekLettenOp,
    setSpecifiekLettenOp,
  } = useEnrichedPointState();

  return (
    <div className="space-y-5 text-[16px]">
      <CheckBoxComp
        checked={vertrouwelijk}
        value={vertrouwelijk}
        setValue={setVertrouwelijk}
        label="Vertrouwelijk"
      />

      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label="Herhalen"
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={omschrijving}
          setValue={setOmschrijving}
          label="Omschrijving"
        />
      </div>

      <SelectComp
        label="Activiteit"
        value={activiteit}
        setValue={setActiviteit}
        options={activities}
      />

      <SelectComp
        label="Organisatie"
        value={organisatie}
        setValue={setOrganisatie}
        options={organizations}
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={specifiekLettenOp}
          setValue={setSpecifiekLettenOp}
          label="Specifiek letten op"
        />
      </div>
    </div>
  );
}
