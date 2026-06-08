import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import GeometryOmschrijvingField from "./GeometryOmschrijvingField";

export default function Form() {
  const {
    omschrijving,
    setOmschrijving,
    vertrouwelijk,
    setVertrouwelijk,
    herhalen,
    setHerhalen,
    activiteit,
    setActiviteit,
    organisatie,
    setOrganisatie,
    specifiekLettenOp,
    setSpecifiekLettenOp,
  } = useDrawingStore();

  return (
    <AandachtspuntDetailsFields
      vertrouwelijk={vertrouwelijk}
      setVertrouwelijk={setVertrouwelijk}
      herhalen={herhalen}
      setHerhalen={setHerhalen}
      activiteit={activiteit}
      setActiviteit={setActiviteit}
      organisatie={organisatie}
      setOrganisatie={setOrganisatie}
      specifiekLettenOp={specifiekLettenOp}
      setSpecifiekLettenOp={setSpecifiekLettenOp}
      omschrijvingField={
        <GeometryOmschrijvingField
          omschrijving={omschrijving}
          setOmschrijving={setOmschrijving}
        />
      }
    />
  );
}
