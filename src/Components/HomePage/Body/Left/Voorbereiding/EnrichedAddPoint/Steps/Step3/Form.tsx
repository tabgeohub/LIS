import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import Omschrijving from "./Omschrijving";

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
  } = useEnrichedPointState();

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
        <Omschrijving
          omschrijving={omschrijving}
          setOmschrijving={setOmschrijving}
        />
      }
    />
  );
}
