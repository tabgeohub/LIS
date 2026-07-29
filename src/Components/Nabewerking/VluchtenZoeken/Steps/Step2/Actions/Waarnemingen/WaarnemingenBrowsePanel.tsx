import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { useContent } from "hooks/useContent";
import type { TabType } from "Types";
import { ActionType } from "../..";
import { WaarnemingenButtons } from "./WaarnemingenButtons";
import { WaarnemingenList } from "./WaarnemingenList";
import type { useWaarnemingenFilters } from "./useWaarnemingenFilters";

type Model = ReturnType<typeof useWaarnemingenFilters>;

export function WaarnemingenBrowsePanel(props: {
  model: Model;
  setAction: (value: ActionType) => void;
  setSelectedTab: (value: TabType) => void;
}) {
  const { model, setAction, setSelectedTab } = props;
  const content = useContent();
  return (
    <>
      <p className="text-[12px]">
        {content.nabewerking.vluchtenZoeken.step2.waarnemingen.text}
      </p>
      <ScrollButtonsLayout
        setFilterTerm={model.setValue}
        className="h-[93%]"
        buttons={
          <WaarnemingenButtons
            setAction={setAction}
            setValue={model.setValue}
            setOpenEdit={model.setOpenEdit}
            setSelectedTab={setSelectedTab}
            canNext={!!(model.selectedPoint || model.selectedGeometry)}
          />
        }
      >
        <WaarnemingenList
          filteredGeometries={model.filteredGeometries}
          filteredPoints={model.filteredPoints}
          selectedGeometry={model.selectedGeometry}
          selectedPoint={model.selectedPoint}
          setSelectedGeometry={model.setSelectedGeometry}
          setSelectedPoint={model.setSelectedPoint}
        />
      </ScrollButtonsLayout>
    </>
  );
}
