import MapComp from "./MapComp";
import { MapViewOverlays } from "./MapViewOverlays";
import type { useMapViewCompModel } from "./useMapViewCompModel";

type Model = ReturnType<typeof useMapViewCompModel>;

export function MapViewMapSection(model: Model) {
  const { panel, openTable } = model;
  return (
    <div
      className="bg-gray-100 overflow-hidden relative"
      style={{ height: panel.mapSectionHeight }}
    >
      <MapComp mapDiv={model.mapDiv} />
      <MapViewOverlays {...model} />
      {openTable && (
        <div
          onMouseDown={panel.onMouseDown}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-gradient-to-b from-transparent to-gray-200"
          title="Sleep om de hoogte van het paneel aan te passen"
        />
      )}
    </div>
  );
}
