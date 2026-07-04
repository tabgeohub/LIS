import { useAddPointStates } from "../../../../../../../hooks/zustand/useAddPointStates";
import WizardHerhalenSelectButtons from "Components/HomePage/Body/Left/Common/WizardHerhalenSelectButtons";
import { useHerhalenSelectionHandlers } from "hooks/points/useHerhalenSelectionHandlers";

export default function SelectButtons({
  herhalen,
  selectedGeometries,
  setSelectedGeometries,
  filteredGeometries,
}: {
  herhalen: boolean;
  selectedGeometries?: number[];
  setSelectedGeometries?: (value: number[]) => void;
  filteredGeometries?: { id: number; herhalen: number | string | boolean }[];
}) {
  const { setSelectedPoints, setSelectedPoints2 } = useAddPointStates();

  const { handleSelectAll, handleSelectNone } = useHerhalenSelectionHandlers({
    herhalen,
    filteredGeometries,
    setters: {
      setSelectedPoints,
      setSelectedPoints2,
      setSelectedGeometries: setSelectedGeometries ?? (() => {}),
    },
  });

  return (
    <WizardHerhalenSelectButtons
      onSelectAll={handleSelectAll}
      onSelectNone={handleSelectNone}
    />
  );
}
