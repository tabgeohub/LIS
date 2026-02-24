export const handleDragStart = (
  col: string,
  setDraggingCol: (col: string | null) => void
) => {
  setDraggingCol(col);
};

export const handleDragOver = (e: React.DragEvent<HTMLTableHeaderCellElement>) =>
  e.preventDefault();

export const handleDrop = (
  targetCol: string,
  draggingCol: string | null,
  columns: string[],
  setFunction: (value: string[] | ((prev: string[]) => string[])) => void,
  setDraggingCol: (col: string | null) => void
) => {
  if (!draggingCol || draggingCol === targetCol) return;
  const updated = [...columns];
  const fromIndex = updated.indexOf(draggingCol);
  const toIndex = updated.indexOf(targetCol);
  updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, draggingCol);
  setFunction(updated);
  setDraggingCol(null);
};

