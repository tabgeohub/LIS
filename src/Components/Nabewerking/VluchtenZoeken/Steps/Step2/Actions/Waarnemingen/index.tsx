/* eslint-disable react-hooks/exhaustive-deps */
import { useTabState } from "hooks/zustand/ui";
import EditPointDetails from "./EditPointDetails";
import EditGeometryDetails from "./EditGeometryDetails";
import { ActionType } from "../..";
import { useWaarnemingenFilters } from "./useWaarnemingenFilters";
import { WaarnemingenBrowsePanel } from "./WaarnemingenBrowsePanel";

export default function Waarnemingen({
  setAction,
}: {
  setAction: (value: ActionType) => void;
}) {
  const { setSelectedTab } = useTabState();
  const model = useWaarnemingenFilters();

  return (
    <div className="h-full">
      {!model.openEdit && (
        <WaarnemingenBrowsePanel
          model={model}
          setAction={setAction}
          setSelectedTab={setSelectedTab}
        />
      )}
      {model.openEdit && model.selectedPoint && (
        <EditPointDetails setOpenEdit={model.setOpenEdit} />
      )}
      {model.openEdit && model.selectedGeometry && !model.selectedPoint && (
        <EditGeometryDetails setOpenEdit={model.setOpenEdit} />
      )}
    </div>
  );
}
