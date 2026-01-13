import Head from "./Head";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import LayersList from "./LayersList";
import BasemapsList from "./BasemapsList";

export default function KaartLegend() {
  const { selectedBottomTab } = useSelectedBottomTabState();

  return (
    <>
      {selectedBottomTab === "Kaartlagenlijst" && (
        <div className="h-[93%]">
          <Head />

          <div className="h-full overflow-y-scroll thin-scrollbar overflow-x-hidden">
            <LayersList />

            <BasemapsList />
          </div>
        </div>
      )}
    </>
  );
}
