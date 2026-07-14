import { useCallback } from "react";
import {
  handleDragStart,
  handleDrop,
} from "../functions/columnDragHandlers";
import { syncScrollPositions } from "../functions/syncScrollPositions";

export function usePointsViewInteractions(input: {
  draggingCol: string | null;
  setDraggingCol: (column: string | null) => void;
  topScrollRef: React.RefObject<HTMLDivElement>;
  tableScrollRef: React.RefObject<HTMLDivElement>;
  syncingRef: React.MutableRefObject<boolean>;
}) {
  const handleDragStartWrapper = useCallback(
    (column: string) => handleDragStart(column, input.setDraggingCol),
    [input.setDraggingCol]
  );
  const handleDropWrapper = useCallback(
    (
      targetCol: string,
      columns: string[],
      setFunction: (value: string[] | ((previous: string[]) => string[])) => void
    ) =>
      handleDrop({
        targetCol,
        draggingCol: input.draggingCol,
        columns,
        setFunction,
        setDraggingCol: input.setDraggingCol,
      }),
    [input.draggingCol, input.setDraggingCol]
  );
  const handleScrollSync = useCallback(
    (source: "top" | "table") => syncScrollPositions({ source, ...input }),
    [input.topScrollRef, input.tableScrollRef, input.syncingRef]
  );
  return { handleDragStartWrapper, handleDropWrapper, handleScrollSync };
}
