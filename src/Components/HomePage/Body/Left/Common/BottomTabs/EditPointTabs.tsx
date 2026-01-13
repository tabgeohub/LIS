import { classNames } from "@helpers/classNames";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useContent } from "hooks/useContent";

import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdOutlineNoteAdd } from "react-icons/md";
import { RiListView } from "react-icons/ri";

export default function EditPointTabs() {
  const { clickedPoint } = usePopUpState();
  const { selectedBottomTab } = useSelectedBottomTabState();

  const content = useContent();

  return (
    <>
      {selectedBottomTab === "viewSelectedPointDetails" && (
        <button
          className={classNames(
            "px-3 flex items-center gap-x-3",
            selectedBottomTab === "viewSelectedPointDetails" &&
              "bg-white shadow"
          )}
        >
          <FaSearch className="size-6 text-blue-500" />

          <span className="text-xs font-semibold">
            {clickedPoint !== null && clickedPoint.omschrijving}
          </span>
        </button>
      )}

      {selectedBottomTab === "editSelectedPoint" && (
        <button
          className={classNames(
            "px-3 flex items-center gap-x-3",
            selectedBottomTab === "editSelectedPoint" && "bg-white shadow"
          )}
        >
          <FaRegEdit className="size-6 text-blue-500" />

          <span className="text-xs font-semibold">
            {content.bottomSection.editPointTabs.editPoint}
          </span>
        </button>
      )}

      {selectedBottomTab === "deletePoint" && (
        <button
          className={classNames(
            "px-3 flex items-center gap-x-3",
            selectedBottomTab === "deletePoint" && "bg-white shadow"
          )}
        >
          <MdDelete className="size-6 text-blue-500" />

          <span className="text-xs font-semibold">
            {content.bottomSection.editPointTabs.deletePoint}
          </span>
        </button>
      )}

      {selectedBottomTab === "viewPlans" && (
        <button
          className={classNames(
            "px-3 flex items-center gap-x-3",
            selectedBottomTab === "viewPlans" && "bg-white shadow"
          )}
        >
          <RiListView className="size-6 text-blue-500" />

          <span className="text-xs font-semibold">
            {content.bottomSection.editPointTabs.viewObservations}
          </span>
        </button>
      )}

      {selectedBottomTab === "addToPlan" && (
        <button
          className={classNames(
            "px-3 flex items-center gap-x-3",
            selectedBottomTab === "addToPlan" && "bg-white shadow"
          )}
        >
          <MdOutlineNoteAdd className="size-6 text-blue-500" />

          <span className="text-xs font-semibold">
            {" "}
            {content.bottomSection.editPointTabs.addToPlan}
          </span>
        </button>
      )}
    </>
  );
}
