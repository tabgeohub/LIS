import AandachtspuntDetailsFields from "Components/Common/AandachtspuntDetailsFields";
import { useDrawingStore } from "Components/Voorbereiding/DrawingTool/useDrawingStore";
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
