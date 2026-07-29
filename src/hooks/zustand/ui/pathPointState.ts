import { create } from "zustand";

export interface PathPointType {
  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;
  rotationAngle: number;
  planId: string;
  vluchtnummer: string;
}

export const usePathPointState = create<{
  selectedPathPoint: PathPointType | null;
  setSelectedPathPoint: (selectedPathPoint: PathPointType | null) => void;
}>((set) => ({
  selectedPathPoint: null,
  setSelectedPathPoint: (selectedPathPoint: PathPointType | null) =>
    set({ selectedPathPoint }),
}));
