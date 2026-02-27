import { useEffect, useState, useRef } from "react";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useUpdateData } from "utils/useUpdateData";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

export default function EditPointCoordinates({
  setAction,
}: {
  setAction: (value: string) => void;
}) {
  const logAction = useLogAction();
  const content = useContent();

  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();

  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
  } = useMapViewState();

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  const [coordinateSystem, setCoordinateSystem] = useState<string>("WGS84");
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [xcoordinaat_rd, setXCoordinaat_rd] = useState<number>(0);
  const [ycoordinaat_rd, setYCoordinaat_rd] = useState<number>(0);

  const clickHandleRef = useRef<__esri.Handle | null>(null);

  useEffect(() => {
    if (!selectedPoint) return;

    // Initialize with current point coordinates
    setLongitude(selectedPoint.longitude || 0);
    setLatitude(selectedPoint.latitude || 0);
    setXCoordinaat_rd(selectedPoint.xcoordinaat_rd || 0);
    setYCoordinaat_rd(selectedPoint.ycoordinaat_rd || 0);

    // Show current point on map with red marker
    if (
      validateMapView(mapView, redGraphicsLayer) &&
      selectedPoint.longitude &&
      selectedPoint.latitude
    ) {
      redGraphicsLayer.removeAll();
      const pointGraphic = createPoint(
        selectedPoint.longitude,
        selectedPoint.latitude
      );
      redGraphicsLayer.add(pointGraphic);

      // Ensure red layer is on top
      if (mapView.map && redGraphicsLayer) {
        mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
      }
    }
  }, [selectedPoint, mapView, redGraphicsLayer]);

  // Transform coordinates when coordinate system changes
  useEffect(() => {
    if (!selectedPoint) return;

    if (coordinateSystem === "RD") {
      // Convert RD to WGS84 for display
      if (xcoordinaat_rd && ycoordinaat_rd) {
        const transformed = getTransformedCoordinates(
          "RD",
          "WGS84",
          xcoordinaat_rd,
          ycoordinaat_rd
        );
        setLongitude(transformed.x);
        setLatitude(transformed.y);
      }
    } else if (coordinateSystem === "WGS84") {
      // Convert WGS84 to RD for display
      if (longitude && latitude) {
        const transformed = getTransformedCoordinates(
          "WGS84",
          "RD",
          longitude,
          latitude
        );
        setXCoordinaat_rd(transformed.x);
        setYCoordinaat_rd(transformed.y);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinateSystem]);

  // Map click handler to update coordinates
  useEffect(() => {
    if (!mapView || !redGraphicsLayer) return;

    const clickHandle = mapView.on("click", async (event) => {
      // Prevent other handlers from processing this click
      // @ts-ignore
      event.stopPropagation?.();

      if (!event.mapPoint?.longitude || !event.mapPoint?.latitude) return;

      const clickedLon = event.mapPoint.longitude;
      const clickedLat = event.mapPoint.latitude;

      // Update coordinates based on current coordinate system
      if (coordinateSystem === "WGS84") {
        setLongitude(clickedLon);
        setLatitude(clickedLat);

        const transformed = getTransformedCoordinates(
          "WGS84",
          "RD",
          clickedLon,
          clickedLat
        );
        setXCoordinaat_rd(transformed.x);
        setYCoordinaat_rd(transformed.y);
      } else {
        const transformed = getTransformedCoordinates(
          "WGS84",
          "RD",
          clickedLon,
          clickedLat
        );
        setXCoordinaat_rd(transformed.x);
        setYCoordinaat_rd(transformed.y);

        setLongitude(clickedLon);
        setLatitude(clickedLat);
      }

      // Update red marker on map
      redGraphicsLayer.removeAll();
      const pointGraphic = createPoint(clickedLon, clickedLat);
      redGraphicsLayer.add(pointGraphic);

      // Ensure red layer is on top
      if (mapView.map && redGraphicsLayer) {
        mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
      }

      logAction({
        message: "User clicked on map to update point coordinates",
        step: "Second step - Edit point coordinates",
        newData: {
          longitude: clickedLon,
          latitude: clickedLat,
        },
      });
    });

    clickHandleRef.current = clickHandle;

    return () => {
      clickHandle?.remove();
    };
  }, [mapView, redGraphicsLayer, coordinateSystem, logAction]);

  // Update map when coordinates change manually (debounced to avoid too many updates)
  useEffect(() => {
    if (!mapView || !redGraphicsLayer || !pointsGraphicsLayer || !selectedPoint)
      return;
    if (!longitude || !latitude) return;

    // Debounce updates to avoid excessive re-renders
    const timeoutId = setTimeout(() => {
      // Find and remove the old point graphic from pointsGraphicsLayer
      const oldGraphics = pointsGraphicsLayer.graphics.toArray();
      const oldGraphic = oldGraphics.find(
        (g: __esri.Graphic) => g.attributes?.id === selectedPoint.id
      );

      if (oldGraphic) {
        pointsGraphicsLayer.remove(oldGraphic);
      }

      // Add updated point to pointsGraphicsLayer (blue point)
      const blueSymbol = new SimpleMarkerSymbol({
        color: "blue",
        size: 12,
        style: "circle",
        outline: {
          color: "white",
          width: 1,
        },
      });

      const updatedGraphic = new Graphic({
        geometry: new Point({
          longitude: longitude,
          latitude: latitude,
          spatialReference: { wkid: 4326 },
        }),
        symbol: blueSymbol,
        attributes: {
          ...selectedPoint,
          longitude: longitude,
          latitude: latitude,
        },
      });

      pointsGraphicsLayer.add(updatedGraphic);

      // Update red marker to show new location (preview)
      redGraphicsLayer.removeAll();
      const newPointGraphic = createPoint(longitude, latitude);
      redGraphicsLayer.add(newPointGraphic);

      // Ensure red layer is on top
      if (mapView.map && redGraphicsLayer) {
        mapView.map.reorder(redGraphicsLayer, mapView.map.layers.length - 1);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    longitude,
    latitude,
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
  ]);

  function handleSubmit() {
    if (!selectedPoint) return;

    // Ensure both coordinate systems are updated
    let finalLongitude = longitude;
    let finalLatitude = latitude;
    let finalXCoord = xcoordinaat_rd;
    let finalYCoord = ycoordinaat_rd;

    if (coordinateSystem === "RD") {
      // Convert RD to WGS84
      const transformed = getTransformedCoordinates(
        "RD",
        "WGS84",
        xcoordinaat_rd,
        ycoordinaat_rd
      );
      finalLongitude = transformed.x;
      finalLatitude = transformed.y;
    } else if (coordinateSystem === "WGS84") {
      // Convert WGS84 to RD
      const transformed = getTransformedCoordinates(
        "WGS84",
        "RD",
        longitude,
        latitude
      );
      finalXCoord = transformed.x;
      finalYCoord = transformed.y;
    }

    const payload = {
      ...selectedPoint,
      longitude: finalLongitude,
      latitude: finalLatitude,
      xcoordinaat_rd: finalXCoord,
      ycoordinaat_rd: finalYCoord,
      regio_id: selectedPoint.regio_id,
      vertrouwelijk: selectedPoint.vertrouwelijk,
      herhalen: selectedPoint.herhalen,
      user_id: selectedPoint.user_id,
      activiteit_id: selectedPoint.activiteit_id,
      organisatie_id: selectedPoint.organisatie_id,
      specifiek_letten_op: selectedPoint.specifiek_letten_op,
      datum: selectedPoint.datum,
      id: selectedPoint.id,
    };

    update(payload, (responseData) => {
      if (!responseData.result) return;

      if (!selectedPlan) return;

      const updatedPoint = {
        ...selectedPoint,
        longitude: finalLongitude,
        latitude: finalLatitude,
        xcoordinaat_rd: finalXCoord,
        ycoordinaat_rd: finalYCoord,
      };

      setSelectedPoint(updatedPoint);

      setSelectedPlan({
        ...selectedPlan,
        points_data: [
          ...selectedPlan.points_data.filter(
            (point) => point.id !== selectedPoint.id
          ),
          updatedPoint,
        ],
      });

      // Update point on map - remove old, add new
      if (mapView && pointsGraphicsLayer) {
        // Remove old point
        const oldGraphics = pointsGraphicsLayer.graphics.toArray();
        const oldGraphic = oldGraphics.find(
          (g: __esri.Graphic) => g.attributes?.id === selectedPoint.id
        );
        if (oldGraphic) {
          pointsGraphicsLayer.remove(oldGraphic);
        }

        // Add new point at updated location
        const blueSymbol = new SimpleMarkerSymbol({
          color: "blue",
          size: 12,
          style: "circle",
          outline: {
            color: "white",
            width: 1,
          },
        });

        const newGraphic = new Graphic({
          geometry: new Point({
            longitude: finalLongitude,
            latitude: finalLatitude,
            spatialReference: { wkid: 4326 },
          }),
          symbol: blueSymbol,
          attributes: updatedPoint,
        });

        pointsGraphicsLayer.add(newGraphic);
      }

      // Update yellow marker (selected point marker)
      if (mapView && yellowGraphicsLayer) {
        // Remove old yellow marker
        const oldYellowGraphics = yellowGraphicsLayer.graphics.toArray();
        const oldYellowGraphic = oldYellowGraphics.find(
          (g: __esri.Graphic) => g.attributes?.id === selectedPoint.id
        );
        if (oldYellowGraphic) {
          yellowGraphicsLayer.remove(oldYellowGraphic);
        }

        // Add new yellow marker at updated location
        const yellowSymbol = new SimpleMarkerSymbol({
          color: "yellow",
          size: 12,
          style: "circle",
          outline: {
            color: "white",
            width: 1,
          },
        });

        const newYellowGraphic = new Graphic({
          geometry: new Point({
            longitude: finalLongitude,
            latitude: finalLatitude,
            spatialReference: { wkid: 4326 },
          }),
          symbol: yellowSymbol,
          attributes: updatedPoint,
        });

        yellowGraphicsLayer.add(newYellowGraphic);
      }

      // Clean up red marker
      redGraphicsLayer?.removeAll();

      setAction("form");
    });

    logAction({
      message: "User updated point coordinates",
      step: "Second step - Edit point coordinates",
      newData: {
        coordinateSystem,
        longitude: finalLongitude,
        latitude: finalLatitude,
        xcoordinaat_rd: finalXCoord,
        ycoordinaat_rd: finalYCoord,
      },
    });
  }

  // Store original coordinates to restore if user cancels
  const originalCoordsRef = useRef<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>(null);

  useEffect(() => {
    if (!selectedPoint) return;

    // Store original coordinates
    originalCoordsRef.current = {
      longitude: selectedPoint.longitude || 0,
      latitude: selectedPoint.latitude || 0,
      xcoordinaat_rd: selectedPoint.xcoordinaat_rd || 0,
      ycoordinaat_rd: selectedPoint.ycoordinaat_rd || 0,
    };
  }, [selectedPoint]);

  // Cleanup on unmount - restore original point if not saved
  useEffect(() => {
    return () => {
      clickHandleRef.current?.remove();
      redGraphicsLayer?.removeAll();

      // Restore original point if coordinates were changed but not saved
      const originalCoords = originalCoordsRef.current;
      if (originalCoords && mapView && pointsGraphicsLayer && selectedPoint) {
        // Remove any preview graphics
        const currentGraphics = pointsGraphicsLayer.graphics.toArray();
        const previewGraphic = currentGraphics.find(
          (g: __esri.Graphic) =>
            g.attributes?.id === selectedPoint.id &&
            (g.geometry as Point).longitude !== originalCoords.longitude
        );

        if (previewGraphic) {
          pointsGraphicsLayer.remove(previewGraphic);

          // Restore original point
          const blueSymbol = new SimpleMarkerSymbol({
            color: "blue",
            size: 12,
            style: "circle",
            outline: {
              color: "white",
              width: 1,
            },
          });

          const originalGraphic = new Graphic({
            geometry: new Point({
              longitude: originalCoords.longitude,
              latitude: originalCoords.latitude,
              spatialReference: { wkid: 4326 },
            }),
            symbol: blueSymbol,
            attributes: {
              ...selectedPoint,
              longitude: originalCoords.longitude,
              latitude: originalCoords.latitude,
            },
          });

          pointsGraphicsLayer.add(originalGraphic);
        }
      }
    };
  }, [redGraphicsLayer, mapView, pointsGraphicsLayer, selectedPoint]);

  if (!selectedPoint) return <div></div>;

  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            onClick={() => {
              setAction("form");

              logAction({
                message: "User clicked 'Previous' button",
                step: "Second step - Edit point coordinates",
              });
            }}
            className="gray-button"
          >
            {content.common.vorige}
          </button>

          <button onClick={handleSubmit} className="gray-button">
            {content.common.opslaan}
          </button>
        </>
      }
    >
      <div className="px-2 space-y-3 mt-4">
        <p className="text-gray-800 leading-3 text-[12px]">
          Wijzig de coördinaten van het punt. U kunt ook op de kaart klikken om
          de coördinaten bij te werken.
        </p>

        <SelectComp
          value={coordinateSystem}
          setValue={setCoordinateSystem}
          label="Coördinatensysteem"
          options={[
            {
              value: "RD",
              label: "RD",
            },
            {
              value: "WGS84",
              label: "WGS84",
            },
          ]}
        />

        {coordinateSystem === "RD" && (
          <>
            <InputCompNum
              label="X"
              value={xcoordinaat_rd}
              setValue={setXCoordinaat_rd}
            />

            <InputCompNum
              label="Y"
              value={ycoordinaat_rd}
              setValue={setYCoordinaat_rd}
            />
          </>
        )}

        {coordinateSystem === "WGS84" && (
          <>
            <InputCompNum
              label="Longitude"
              value={longitude}
              setValue={setLongitude}
            />

            <InputCompNum
              label="Latitude"
              value={latitude}
              setValue={setLatitude}
            />
          </>
        )}
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500/20 bg-opacity-50 z-10">
          <LoadingBars />
        </div>
      )}
    </ScrollButtonsLayout>
  );
}
