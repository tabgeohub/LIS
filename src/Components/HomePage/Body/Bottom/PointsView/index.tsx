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
  const {
    tab,
    setTab,
    clickedPoint,
    clickedPointPosition,
    setClickedPoint,
    setClickedPointPosition,
    starredPoints,
    setStarredPoints,
    starredPlans,
    setStarredPlans,
    starredGeometries,
    setStarredGeometries,
    pointsTable,
    flightPlans,
    geometriesTable,
    popupRef,
    headerRef,
    tableScrollRef,
    topScrollRef,
    syncingRef,
    originalGraphicsMap,
    availableHeight,
    needsHorizontalScroll,
    scrollAreaHeight,
    tableScrollWidth,
    handleDragStartWrapper,
    handleDragOver,
    handleDropWrapper,
    handleScrollSync,
  } = usePointsViewController(containerHeight);

  return (
    <div className="h-full w-full flex flex-col min-w-0 min-h-0">
      <div ref={headerRef} className="shrink-0 min-w-0 max-w-full overflow-hidden">
        <TabButtons
          tab={tab}
          setTab={setTab}
          pointsTableLength={pointsTable.length}
          geometriesTableLength={geometriesTable.length}
          flightPlansLength={flightPlans.length}
        />
      </div>

      <div
        className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden flex flex-col"
        style={{
          maxHeight:
            typeof availableHeight === "number"
              ? `${availableHeight}px`
              : undefined,
        }}
      >
        <HorizontalScrollControls
          needsHorizontalScroll={needsHorizontalScroll}
          tableScrollWidth={tableScrollWidth}
          topScrollRef={topScrollRef}
          tableScrollRef={tableScrollRef}
          syncingRef={syncingRef}
        />
        <div
          className="flex-1 min-h-0 min-w-0 max-w-full w-full overflow-x-auto overflow-y-auto overscroll-contain thin-scrollbar"
          ref={tableScrollRef}
          onScroll={() => handleScrollSync("table")}
          style={{
            maxHeight:
              typeof scrollAreaHeight === "number"
                ? `${scrollAreaHeight}px`
                : undefined,
          }}
        >
          <PointsViewTables
            tab={tab}
            containerHeight={availableHeight}
            containerWidth={containerWidth}
            starredPoints={starredPoints}
            setStarredPoints={setStarredPoints}
            starredPlans={starredPlans}
            setStarredPlans={setStarredPlans}
            starredGeometries={starredGeometries}
            setStarredGeometries={setStarredGeometries}
            handleDragStart={handleDragStartWrapper}
            handleDragOver={handleDragOver}
            handleDrop={handleDropWrapper}
            setClickedPoint={setClickedPoint}
            setClickedPointPosition={setClickedPointPosition}
            originalGraphicsMap={originalGraphicsMap}
          />
        </div>
      </div>

      <ClickedPointPopup
        clickedPoint={clickedPoint}
        clickedPointPosition={clickedPointPosition}
        popupRef={popupRef}
      />
    </div>
  );
}
