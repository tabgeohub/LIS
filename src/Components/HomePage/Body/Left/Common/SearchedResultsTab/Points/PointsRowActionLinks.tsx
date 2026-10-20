import { useContent } from "hooks/useContent";
import { useCanEdit } from "hooks/useCanEdit";

export function PointsRowActionLinks(props: {
  onEdit: () => void;
  onDelete: () => void;
  onViewPlans: () => void;
  onAddToPlan: () => void;
}) {
  const tabs = useContent().bottomSection.editPointTabs;
  const userCanEdit = useCanEdit();
  const linkClass =
    "cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all";

  return (
    <div className="text-blue-500 text-sm font-medium mt-4">
      {userCanEdit && (
        <>
          <span onClick={props.onEdit} className={linkClass}>
            {tabs.editPoint}
          </span>
          <span className="mx-2">-</span>
          <span onClick={props.onDelete} className={linkClass}>
            {tabs.deletePoint}
          </span>
          <span className="mx-2">-</span>
        </>
      )}
      <span onClick={props.onViewPlans} className={linkClass}>
        {tabs.viewObservations}
      </span>
      {userCanEdit && (
        <>
          <span className="mx-2">-</span>
          <span onClick={props.onAddToPlan} className={linkClass}>
            {tabs.addToPlan}
          </span>
        </>
      )}
    </div>
  );
}
