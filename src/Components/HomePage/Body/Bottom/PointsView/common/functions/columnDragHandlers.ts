export const handleDragStart = (
  col: string,
  setDraggingCol: (col: string | null) => void
) => {
  setDraggingCol(col);
};

export const handleDragOver = (e: React.DragEvent<HTMLTableHeaderCellElement>) =>
  e.preventDefault();

export const handleDrop = (input: {
  targetCol: string;
  draggingCol: string | null;
  columns: string[];
  setFunction: (value: string[] | ((prev: string[]) => string[])) => void;
  setDraggingCol: (col: string | null) => void;
}) => {
  if (!input.draggingCol || input.draggingCol === input.targetCol) return;
  const updated = [...input.columns];
  const fromIndex = updated.indexOf(input.draggingCol);
  const toIndex = updated.indexOf(input.targetCol);
  updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, input.draggingCol);
  input.setFunction(updated);
  input.setDraggingCol(null);
};
