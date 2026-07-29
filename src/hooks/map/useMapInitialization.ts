/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useRef, useEffect } from "react";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { initializeMapState } from "./initializeMapState";

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
