import { handleDragOver } from "./common/functions/columnDragHandlers";

export function toPointsViewControllerResult(input: {
  state: any;
  refs: any;
  tables: any;
  layout: any;
  interactions: any;
}) {
  const { draggingCol: _, setDraggingCol: __, ...publicState } = input.state;
  return {
    ...publicState,
    ...input.tables,
    ...input.refs,
    ...input.layout,
    ...input.interactions,
    handleDragOver,
  };
}
