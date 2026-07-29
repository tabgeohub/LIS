import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import Omschrijving from "./Omschrijving";

export default function Form() {
  const pointState = useEnrichedPointState();

  return (
    <AandachtspuntDetailsFields
      {...pointState}
      omschrijvingField={
        <Omschrijving
          omschrijving={pointState.omschrijving}
          setOmschrijving={pointState.setOmschrijving}
        />
      }
    />
  );
}
