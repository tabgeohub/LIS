export type CoordinateSyncPatch = {
  rdX?: number;
  rdY?: number;
  latitude?: number;
  longitude?: number;
};

export type CoordinateSyncPatchInput = {
  coordinateSystem: string;
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
};
