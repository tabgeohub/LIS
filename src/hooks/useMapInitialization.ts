/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useRef, useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { initializeMapState } from "./map/initializeMapState";

export function useMapInitialization(mapDiv: RefObject<HTMLDivElement>) {
  const initialized = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (mapDiv.current && !initialized.current) {
      initializeMapState(mapDiv);
      initialized.current = true;
    }
  }, [mapDiv, user.user_id]);
}
