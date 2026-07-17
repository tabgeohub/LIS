import {
  addNewPointClickGraphic,
  applyNewPointClickCoords,
  resolveNewPointClickCoords,
  type NewPointCoordSetters,
} from "./newPointEventCoords";

export type CreateNewPointEventInput = NewPointCoordSetters & {
  event: __esri.ViewClickEvent;
  redGraphicsLayer: __esri.GraphicsLayer;
};

export function createNewPointEvent(input: CreateNewPointEventInput) {
  const coords = resolveNewPointClickCoords(input.event.mapPoint);
  if (!coords) return;

  applyNewPointClickCoords(coords, input);
  addNewPointClickGraphic(input.redGraphicsLayer, coords);
}
