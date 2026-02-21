import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useContent } from "hooks/useContent";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Actions/Buttons";

export default function EditGeometryDetails({
  setOpenEdit,
}: {
  setOpenEdit: (value: boolean) => void;
}) {
  const { selectedGeometry } = useFinishedPlansState();
  const content = useContent();

  if (!selectedGeometry) return <div></div>;

  return (
    <div className="h-[70vh] overflow-auto thin-scrollbar">
      <ScrollButtonsLayout
        buttons={<Buttons setOpenEdit={setOpenEdit} />}
      >
        <div className="text-[12px] px-2 text-gray-700 mt-2 space-y-2">
          <p className="text-lg font-semibold">
            {selectedGeometry.geometry_omschrijving || `Geometrie ${selectedGeometry.id}`}
          </p>
        </div>
      </ScrollButtonsLayout>
    </div>
  );
}

