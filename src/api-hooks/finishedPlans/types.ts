export type PlanPathRow = {
  path?: { latitude: number; longitude: number }[] | null;
  flighttime?: { time: number; action: string }[] | null;
};
