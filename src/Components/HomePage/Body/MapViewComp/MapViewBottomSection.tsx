import Bottom from "../Bottom";
import type { useMapViewCompModel } from "./useMapViewCompModel";

type Model = ReturnType<typeof useMapViewCompModel>;

export function MapViewBottomSection(model: Model) {
  if (!model.openTable) return null;
  const { panel } = model;
  return (
    <div
      ref={panel.bottomContainerRef}
      className="bg-white w-full min-w-0 shrink-0 overflow-hidden flex flex-col"
      style={{ height: `${panel.panelVh}vh` }}
    >
      <Bottom
        vluchtnummer={model.vluchtnummer}
        containerHeight={panel.bottomDimensions.height}
        containerWidth={panel.bottomDimensions.width}
      />
    </div>
  );
}
