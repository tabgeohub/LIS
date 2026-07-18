import { useRef, useState } from "react";
import { snapshotPointCoords } from "./editPointCoordinateSync";

export function useEditPointCoordState() {
  const [coordinateSystem, setCoordinateSystem] = useState("WGS84");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [xcoordinaat_rd, setXCoordinaat_rd] = useState(0);
  const [ycoordinaat_rd, setYCoordinaat_rd] = useState(0);
  const originalCoordsRef = useRef<ReturnType<
    typeof snapshotPointCoords
  > | null>(null);
  return {
    coordinateSystem,
    setCoordinateSystem,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    xcoordinaat_rd,
    setXCoordinaat_rd,
    ycoordinaat_rd,
    setYCoordinaat_rd,
    originalCoordsRef,
  };
}
