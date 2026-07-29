import { classNames } from "@helpers/dom/classNames";
import { usePopUpState } from "hooks/zustand/ui/popUpState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useContent } from "hooks/useContent";
import type { ComponentType } from "react";

import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdOutlineNoteAdd } from "react-icons/md";
import { RiListView } from "react-icons/ri";

type EditPointTabId =
  | "viewSelectedPointDetails"
  | "editSelectedPoint"
  | "deletePoint"
  | "viewPlans"
  | "addToPlan";

type TabIconProps = { className?: string };

type EditPointTabDef = {
  id: EditPointTabId;
  Icon: ComponentType<TabIconProps>;
  label: string;
};

function EditPointTabButton({
  tabId,
  selectedBottomTab,
  Icon,
  label,
}: {
  tabId: EditPointTabId;
  selectedBottomTab: string;
  Icon: ComponentType<TabIconProps>;
  label: string;
}) {
  if (selectedBottomTab !== tabId) return null;

  return (
    <button
      className={classNames(
        "px-3 flex items-center gap-x-3",
        "bg-white shadow"
      )}
    >
      <Icon className="size-6 text-blue-500" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function resolveEditPointTabDefs(input: {
  clickedPointOmschrijving: string | undefined;
  labels: {
    editPoint: string;
    deletePoint: string;
    viewObservations: string;
    addToPlan: string;
  };
}): EditPointTabDef[] {
  return [
    {
      id: "viewSelectedPointDetails",
      Icon: FaSearch,
      label: input.clickedPointOmschrijving ?? "",
    },
    {
      id: "editSelectedPoint",
      Icon: FaRegEdit,
      label: input.labels.editPoint,
    },
    {
      id: "deletePoint",
      Icon: MdDelete,
      label: input.labels.deletePoint,
    },
    {
      id: "viewPlans",
      Icon: RiListView,
      label: input.labels.viewObservations,
    },
    {
      id: "addToPlan",
      Icon: MdOutlineNoteAdd,
      label: ` ${input.labels.addToPlan}`,
    },
  ];
}

export default function EditPointTabs() {
  const { clickedPoint } = usePopUpState();
  const { selectedBottomTab } = useSelectedBottomTabState();
  const content = useContent();

  const tabs = resolveEditPointTabDefs({
    clickedPointOmschrijving:
      clickedPoint !== null ? clickedPoint.omschrijving : undefined,
    labels: content.bottomSection.editPointTabs,
  });

  return (
    <>
      {tabs.map((tab) => (
        <EditPointTabButton
          key={tab.id}
          tabId={tab.id}
          selectedBottomTab={selectedBottomTab}
          Icon={tab.Icon}
          label={tab.label}
        />
      ))}
    </>
  );
}
