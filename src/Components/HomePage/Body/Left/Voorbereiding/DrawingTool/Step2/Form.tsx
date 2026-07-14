import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import GeometryOmschrijvingField from "./GeometryOmschrijvingField";

export default function Form() {
  const drawingState = useDrawingStore();

  return (
    <AandachtspuntDetailsFields
      {...drawingState}
      omschrijvingField={
        <GeometryOmschrijvingField
          omschrijving={drawingState.omschrijving}
          setOmschrijving={drawingState.setOmschrijving}
        />
      }
    />
  );
}
