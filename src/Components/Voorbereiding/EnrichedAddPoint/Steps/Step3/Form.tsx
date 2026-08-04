import { useEnrichedPointState } from "Components/Voorbereiding/EnrichedAddPoint/state/useEnrichedPointState";
import AandachtspuntDetailsFields from "Components/Common/AandachtspuntDetailsFields";
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
