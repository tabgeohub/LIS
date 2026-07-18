export const PLAN_BOUNDING_BOX_SYMBOLS_STAR = {
  starSearch: {
    fillColor: [0, 255, 0, 0] as [number, number, number, number],
    outlineColor: [0, 0, 255, 1] as [number, number, number, number],
    outlineWidth: 5,
  },
  starTable: {
    fillColor: [0, 255, 0, 0] as [number, number, number, number],
    outlineColor: [0, 0, 255, 1] as [number, number, number, number],
    outlineWidth: 2,
  },
  finishedPlanClick: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [0, 255, 0, 0.7] as [number, number, number, number],
    outlineWidth: 5,
  },
  finishedPlanHover: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [0, 255, 0, 0.1] as [number, number, number, number],
    outlineWidth: 5,
  },
} as const;
