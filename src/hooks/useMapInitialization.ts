/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useRef, useEffect } from "react";
import createMapView from "@helpers/ArcGISHelpers/createMapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export function useMapInitialization(mapDiv: RefObject<HTMLDivElement>) {
  const initialized = useRef(false);
  const { user } = useAuth();

  const {
    setMap,
    setMapView,
    setPointsGraphicsLayer,
    setGraphicsLayer,
    setGraphicsLayerHover,
    setYellowGraphicsLayer,
    setYellowGeometriesGraphicsLayer,
    setRedGraphicsLayer,
    setSelectedPointGraphicsLayer,
    setGeometriesGraphicsLayer,
  } = useMapViewState();

  useEffect(() => {
    if (mapDiv.current && !initialized.current) {
      const {
        map,
        mapView,
        graphicsLayer,
        pointsGraphicsLayer,
        graphicsLayerHover,
        yellowGraphicsLayer,
        yellowGeometriesGraphicsLayer,
        redGraphicsLayer,
        selectedPointGraphicsLayer,
        geometriesGraphicsLayer,
      } = createMapView(mapDiv);

      setMap(map);
      setMapView(mapView);
      setGraphicsLayer(graphicsLayer);
      setGraphicsLayerHover(graphicsLayerHover);
      setPointsGraphicsLayer(pointsGraphicsLayer);
      setYellowGraphicsLayer(yellowGraphicsLayer);
      setYellowGeometriesGraphicsLayer(yellowGeometriesGraphicsLayer);
      setRedGraphicsLayer(redGraphicsLayer);
      setSelectedPointGraphicsLayer(selectedPointGraphicsLayer);
      setGeometriesGraphicsLayer(geometriesGraphicsLayer);

      initialized.current = true;
    }
  }, [mapDiv, user.user_id]);
}
