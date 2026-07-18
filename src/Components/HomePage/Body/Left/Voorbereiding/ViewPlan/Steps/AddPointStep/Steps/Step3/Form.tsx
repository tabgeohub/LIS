import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";

export default function Form() {
  const pointState = useEnrichedPointState();

  return (
    <AandachtspuntDetailsFields
      {...pointState}
      labels={{
        vertrouwelijk: "Vertrouwelijk",
        herhalen: "Herhalen",
        activiteit: "Activiteit",
        organisatie: "Organisatie",
        specifiekLettenOp: "Specifiek letten op",
      }}
      omschrijvingField={
        <div className="grid grid-cols-6 gap-x-2 items-start">
          <TextAreaComp
            value={pointState.omschrijving}
            setValue={pointState.setOmschrijving}
            label="Omschrijving"
          />
        </div>
      }
    />
  );
}
