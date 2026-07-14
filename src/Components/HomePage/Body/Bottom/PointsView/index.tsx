import TabButtons from "./common/components/TabButtons";
import HorizontalScrollControls from "./common/components/HorizontalScrollControls";
import ClickedPointPopup from "./common/components/ClickedPointPopup";
import PointsViewTables from "./PointsViewTables";
import { usePointsViewController } from "./usePointsViewController";

interface PointsViewProps {
  containerHeight: number;
  containerWidth: number;
}

export default function PointsView({
  containerHeight,
  containerWidth,
}: PointsViewProps) {
  const controller = usePointsViewController(containerHeight);

  return (
    <div className="h-full w-full flex flex-col min-w-0 min-h-0">
      <div ref={controller.headerRef} className="shrink-0 min-w-0 max-w-full overflow-hidden">
        <TabButtons
          tab={controller.tab}
          setTab={controller.setTab}
          pointsTableLength={controller.pointsTable.length}
          geometriesTableLength={controller.geometriesTable.length}
          flightPlansLength={controller.flightPlans.length}
        />
      </div>

      <div
        className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden flex flex-col"
        style={{
          maxHeight:
            typeof controller.availableHeight === "number"
              ? `${controller.availableHeight}px`
              : undefined,
        }}
      >
        <HorizontalScrollControls
          needsHorizontalScroll={controller.needsHorizontalScroll}
          tableScrollWidth={controller.tableScrollWidth}
          topScrollRef={controller.topScrollRef}
          tableScrollRef={controller.tableScrollRef}
          syncingRef={controller.syncingRef}
        />
        <div
          className="flex-1 min-h-0 min-w-0 max-w-full w-full overflow-x-auto overflow-y-auto overscroll-contain thin-scrollbar"
          ref={controller.tableScrollRef}
          onScroll={() => controller.handleScrollSync("table")}
          style={{
            maxHeight:
              typeof controller.scrollAreaHeight === "number"
                ? `${controller.scrollAreaHeight}px`
                : undefined,
          }}
        >
          <PointsViewTables
            tab={controller.tab}
            containerHeight={controller.availableHeight}
            containerWidth={containerWidth}
            starredPoints={controller.starredPoints}
            setStarredPoints={controller.setStarredPoints}
            starredPlans={controller.starredPlans}
            setStarredPlans={controller.setStarredPlans}
            starredGeometries={controller.starredGeometries}
            setStarredGeometries={controller.setStarredGeometries}
            handleDragStart={controller.handleDragStartWrapper}
            handleDragOver={controller.handleDragOver}
            handleDrop={controller.handleDropWrapper}
            setClickedPoint={controller.setClickedPoint}
            setClickedPointPosition={controller.setClickedPointPosition}
            originalGraphicsMap={controller.originalGraphicsMap}
          />
        </div>
      </div>

      <ClickedPointPopup
        clickedPoint={controller.clickedPoint}
        clickedPointPosition={controller.clickedPointPosition}
        popupRef={controller.popupRef}
      />
    </div>
  );
}
