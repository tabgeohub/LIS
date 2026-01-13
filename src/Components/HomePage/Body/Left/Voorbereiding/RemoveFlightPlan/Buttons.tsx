import { useTabState } from "@helpers/ZustandStates/tabState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons() {
  const logAction = useLogAction();

  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();
  const { setOpenFilter, setOpenDeleteModal, selectedPlan } =
    useDeleteFlightPlan();

  const content = useContent();

  return (
    <>
      <button
        onClick={() => {
          setOpenFilter(true);

          logAction({
            message: "User clicked 'Filter' button",
          });
        }}
        className="gray-button"
      >
        {content.common.filteren}
      </button>

      <button
        onClick={() => {
          setOpenDeleteModal(true);

          logAction({
            message: "User clicked 'Next' button",
          });
        }}
        disabled={!selectedPlan}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          setSelectedTab("none");
          graphicsLayer?.removeAll();
          graphicsLayerHover?.removeAll();

          logAction({
            message: "User clicked 'Cancel' button",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </>
  );
}
