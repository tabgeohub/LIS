import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import ConfirmModal from "./ConfirmModal";
import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons() {
  const logAction = useLogAction();

  const { selectedPlan, setOpenFilter, setSelectedPlan } =
    useChangePlanStatusState();

  const { setSelectedTab } = useTabState();
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();

  const [open, setOpen] = useState(false);

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
        disabled={!selectedPlan}
        onClick={() => {
          setOpen(true);

          logAction({
            message: "User clicked 'Next' button to change flight plan status",
          });
        }}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          graphicsLayer?.removeAll();
          graphicsLayerHover?.removeAll();
          setSelectedPlan(null);
          setSelectedTab("none");

          logAction({
            message: "User clicked 'Cancel' button",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>

      <ConfirmModal open={open} setOpen={setOpen} />
    </>
  );
}
