import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { generateReportZip } from "./generateReportZip";

export type UseHandleStep2Input = {
  selectedPlan: FinishedFlightPlanType;
  selectedPoints: number[];
  selectedGeometries: number[];
  setZipFile: (zipFile: Blob) => void;
  setZippingStatus: (status: string) => void;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
};

function resolveMapServerUrl(selectedBasemap: string) {
  return selectedBasemap === "topo-vector"
    ? "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer"
    : "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
}

export function useHandleStep2(input: UseHandleStep2Input) {
  const {
    selectedPlan,
    selectedPoints,
    selectedGeometries,
    setZipFile,
    setZippingStatus,
    activities,
    organizations,
  } = input;
  const { mapView } = useMapViewState();
  const pilootOptions = useConstSelectOptions("piloten");
  const { selectedBasemap } = useSelectedBasemapState();
  const mapServerUrl = resolveMapServerUrl(selectedBasemap);

  return async function handleStep2() {
    if (!mapView?.map || !selectedPlan) return;

    await generateReportZip({
      map: mapView.map,
      selectedPlan,
      selectedPoints,
      selectedGeometries,
      activities,
      organizations,
      mapServerUrl,
      pilootOptions,
      setZipFile,
      setZippingStatus,
    });
  };
}
