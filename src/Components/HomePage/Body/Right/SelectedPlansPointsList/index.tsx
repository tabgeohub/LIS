import SelectedPlansPointsListBody from "./SelectedPlansPointsListBody";
import SelectedPlansPointsListEmpty from "./SelectedPlansPointsListEmpty";
import SelectedPlansPointsListHeader from "./SelectedPlansPointsListHeader";
import { useSelectedPlansListData } from "./useSelectedPlansListData";
import { useTimesliderListGoTo } from "./useTimesliderListGoTo";
import { useTimesliderRightListHover } from "./useTimesliderRightListHover";

export default function SelectedPlansPointsList() {
  const listItems = useSelectedPlansListData();
  const { onPointEnter, onGeometryEnter, onLeave } =
    useTimesliderRightListHover();
  const { goToPoint, goToGeometry } = useTimesliderListGoTo();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SelectedPlansPointsListHeader count={listItems.length} />
      <div className="min-h-0 flex-1 overflow-auto">
        {listItems.length === 0 ? (
          <SelectedPlansPointsListEmpty />
        ) : (
          <SelectedPlansPointsListBody
            items={listItems}
            onPointEnter={onPointEnter}
            onGeometryEnter={onGeometryEnter}
            onLeave={onLeave}
            onGoToPoint={goToPoint}
            onGoToGeometry={goToGeometry}
          />
        )}
      </div>
    </div>
  );
}
