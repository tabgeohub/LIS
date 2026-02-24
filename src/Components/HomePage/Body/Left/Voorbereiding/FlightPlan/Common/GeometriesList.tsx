import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { TbLine, TbPolygon } from "react-icons/tb";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

// Hook for geometry hover (similar to usePointHover)
function useGeometryHover() {
    const { mapView } = useMapViewState();
    const setHovered = useHoveredGraphicState.getState().setHovered;

    function handleHoveredGeometry(geometry: Geometry | null | undefined) {
        if (!mapView || !geometry) return;

        const graphicsArray = mapView.graphics.toArray();

        graphicsArray
            .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
            .forEach((graphic) => mapView.graphics.remove(graphic));

        // Create hover graphic for geometry
        if (!geometry.points || geometry.points.length === 0) return;

        const coordinates = geometry.points.map((point) => [
            point.longitude,
            point.latitude,
        ]);

        let hoverGraphic: Graphic | null = null;

        if (geometry.type === "polygon") {
            const ring = [...coordinates];
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
                ring.push([first[0], first[1]]);
            }

            const polygon = new Polygon({
                rings: [ring],
                spatialReference: { wkid: 4326 },
            });

            const hoverSymbol = new SimpleFillSymbol({
                color: [0, 0, 0, 0], // Transparent fill
                outline: {
                    color: [255, 213, 0, 0.9], // Yellow outline
                    width: 3,
                },
            });

            hoverGraphic = new Graphic({
                geometry: polygon,
                symbol: hoverSymbol,
                attributes: {
                    label: "hovered-geometry",
                    geometryId: geometry.id,
                },
            });
        } else if (geometry.type === "line") {
            const polyline = new Polyline({
                paths: [coordinates],
                spatialReference: { wkid: 4326 },
            });

            const hoverSymbol = new SimpleLineSymbol({
                color: [255, 213, 0, 0.9], // Yellow
                width: 4,
            });

            hoverGraphic = new Graphic({
                geometry: polyline,
                symbol: hoverSymbol,
                attributes: {
                    label: "hovered-geometry",
                    geometryId: geometry.id,
                },
            });
        }

        if (hoverGraphic) {
            mapView.graphics.add(hoverGraphic);
            setHovered({
                id: geometry.id,
                label: geometry.omschrijving ?? `Geometrie ${geometry.id}`,
                point: {
                    ...geometry,
                    type: "geometry",
                    geometryType: geometry.type === "polygon" ? "polygon" : "line",
                },
            });
        }
    }

    function handleRemoveHoveredGeometry() {
        if (!mapView) return;

        const graphicsArray = mapView.graphics.toArray();

        graphicsArray
            .filter((graphic) => graphic.attributes?.label === "hovered-geometry")
            .forEach((graphic) => mapView.graphics.remove(graphic));

        setHovered(null);
    }

    return {
        handleHoveredGeometry,
        handleRemoveHoveredGeometry,
    };
}

// Hook for drawing yellow geometries (similar to useDrawYellowMarkers)
function useDrawYellowGeometries({
    selectedGeometryIds,
    geometries,
    allGeometries,
    herhalenFilter,
}: {
    selectedGeometryIds: number[];
    geometries: Geometry[];
    allGeometries: Geometry[];
    herhalenFilter?: boolean | null;
}) {
    const { mapView, yellowGraphicsLayer } = useMapViewState();

    useEffect(() => {
        if (!mapView || !yellowGraphicsLayer) return;

        yellowGraphicsLayer.graphics.removeAll();

        if (!selectedGeometryIds || selectedGeometryIds.length === 0) {
            return;
        }

        selectedGeometryIds.forEach((geometryId) => {
            // Use allGeometries for lookup to ensure selected geometries are found even if filtered out
            const geometry = allGeometries.find((g) => g.id === geometryId);
            if (!geometry || !geometry.points || geometry.points.length === 0) return;

            // Filter by herhalen if herhalenFilter is provided
            if (herhalenFilter !== null && herhalenFilter !== undefined) {
                const geometryHerhalen =
                    typeof geometry.herhalen === "number"
                        ? geometry.herhalen === 1
                        : typeof geometry.herhalen === "string"
                            ? geometry.herhalen === "1"
                            : geometry.herhalen === true;
                
                // Only draw geometries that match the herhalen filter
                if (geometryHerhalen !== herhalenFilter) {
                    return;
                }
            }

            const coordinates = geometry.points.map((point) => [
                point.longitude,
                point.latitude,
            ]);

            let graphic: Graphic | null = null;

            if (geometry.type === "polygon") {
                const ring = [...coordinates];
                const first = ring[0];
                const last = ring[ring.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                    ring.push([first[0], first[1]]);
                }

                const polygon = new Polygon({
                    rings: [ring],
                    spatialReference: { wkid: 4326 },
                });

                const yellowSymbol = new SimpleFillSymbol({
                    color: [0, 0, 0, 0], // Transparent fill
                    outline: {
                        color: [255, 255, 0, 1], // Yellow outline
                        width: 3,
                    },
                });

                graphic = new Graphic({
                    geometry: polygon,
                    symbol: yellowSymbol,
                    attributes: geometry,
                });
            } else if (geometry.type === "line") {
                const polyline = new Polyline({
                    paths: [coordinates],
                    spatialReference: { wkid: 4326 },
                });

                const yellowSymbol = new SimpleLineSymbol({
                    color: [255, 255, 0, 1], // Yellow
                    width: 4,
                });

                graphic = new Graphic({
                    geometry: polyline,
                    symbol: yellowSymbol,
                    attributes: geometry,
                });
            }

            if (graphic) {
                yellowGraphicsLayer.add(graphic);
            }
        });
    }, [selectedGeometryIds, geometries, allGeometries, herhalenFilter, mapView, yellowGraphicsLayer]);
}

// Hook for geometry click (similar to usePointClick)
function useGeometryClick(selectedGeometries: Geometry[], allGeometries: Geometry[], herhalenFilter?: boolean | null) {
    const validGeometries = selectedGeometries?.filter((g) => g != null) || [];

    // Use allGeometries to find selected geometries, not just the filtered list
    // This ensures selected geometries are found even if they're not in the current filter
    useDrawYellowGeometries({
        selectedGeometryIds: validGeometries.map((g) => g.id),
        geometries: validGeometries, // Pass selected geometries for reference
        allGeometries: allGeometries, // Use all geometries for lookup
        herhalenFilter: herhalenFilter, // Filter by herhalen to only show geometries matching current step
    });
}

// Geometry Item Checkbox Component
function GeometryItemCheckBox({
    geometry,
    isSelected,
    onMouseEnter,
    onMouseLeave,
    onCheckboxClick,
    onItemClick,
}: {
    geometry: Geometry;
    isSelected: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onCheckboxClick?: (e: React.MouseEvent) => void;
    onItemClick?: () => void;
}) {
    const geometryTypeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";

    const herhalenValue =
        typeof geometry.herhalen === "number"
            ? geometry.herhalen === 1
                ? "Ja"
                : "Nee"
            : typeof geometry.herhalen === "string"
                ? geometry.herhalen === "1"
                    ? "Ja"
                    : "Nee"
                : geometry.herhalen === true
                    ? "Ja"
                    : "Nee";

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            key={geometry.id}
            className={`flex items-start cursor-pointer gap-x-2 py-2 my-1 px-2 transition-all duration-300 ${isSelected
                ? "bg-gray-200 shadow-sm rounded"
                : "hover:bg-blue-100 shadow-sm rounded"
                }`}
            onClick={onItemClick}
        >
            <div className="flex items-center gap-x-2">
                <input
                    checked={isSelected}
                    onClick={onCheckboxClick}
                    type="checkbox"
                    className="size-3 cursor-pointer"
                    readOnly
                />
                {geometry.type === "polygon" ? (
                    <TbPolygon className="size-6 text-yellow-500" />
                ) : (
                    <TbLine className="size-6 text-green-500" />
                )}
            </div>

            <div className="flex flex-col ml-6 text-[10px]">
                <div className="flex gap-x-1 font-medium">
                    <p className="text-gray-800">{geometry.omschrijving}</p>
                </div>

                <div className="flex gap-x-1">
                    <p className="text-gray-600">Type: </p>
                    <p className="text-gray-600">{geometryTypeLabel}</p>
                </div>

                {geometry.activiteit && (
                    <div className="flex gap-x-1">
                        <p className="text-gray-600">Activiteit </p>
                        <p className="text-gray-600">{geometry.activiteit}</p>
                    </div>
                )}

                {geometry.organisatie && (
                    <div className="flex gap-x-1">
                        <p className="text-gray-600">Organisatie </p>
                        <p className="text-gray-600">{geometry.organisatie}</p>
                    </div>
                )}

                {geometry.specifiek_letten_op && (
                    <div className="flex gap-x-1">
                        <p className="text-gray-600">Letten op: </p>
                        <p className="text-gray-600">{geometry.specifiek_letten_op}</p>
                    </div>
                )}

                <div className="flex gap-x-1">
                    <p className="text-gray-600">Herhalen: </p>
                    <p className="text-gray-600">{herhalenValue}</p>
                </div>
            </div>
        </div>
    );
}

// Main GeometriesList Component
export default function GeometriesList({
    selectedGeometries,
    setSelectedGeometries,
    geometries,
}: {
    selectedGeometries: number[];
    setSelectedGeometries: (value: number[]) => void;
    geometries: Geometry[];
}) {
    const logAction = useLogAction();
    const { mapView, redGraphicsLayer } = useMapViewState();
    const { dbGeometries } = useGeometriesStore();

    // Ensure selectedGeometries is always an array
    const safeSelectedGeometries = Array.isArray(selectedGeometries) ? selectedGeometries : [];

    // Determine herhalen filter from the first geometry (if available)
    const firstGeometry = geometries.at(0);
    const herhalenFilter =
        firstGeometry !== undefined
            ? typeof firstGeometry.herhalen === "number"
                ? firstGeometry.herhalen === 1
                : typeof firstGeometry.herhalen === "string"
                    ? firstGeometry.herhalen === "1"
                    : firstGeometry.herhalen === true
            : null;

    // Pass all dbGeometries for lookup, but filtered geometries for the selected list
    useGeometryClick(
        geometries.filter((geometry) => safeSelectedGeometries.includes(geometry.id)),
        dbGeometries, // Use all geometries for lookup
        herhalenFilter // Pass herhalen filter to only draw matching geometries
    );
    const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();

    useEffect(() => {
        const firstGeometry = geometries.at(0);
        const herhalenValue =
            typeof firstGeometry?.herhalen === "number"
                ? firstGeometry.herhalen === 1
                : typeof firstGeometry?.herhalen === "string"
                    ? firstGeometry.herhalen === "1"
                    : firstGeometry?.herhalen === true;
        const step = herhalenValue ? 2 : 3;

        logAction({
            message: `User is selecting geometries`,
            step: `Step ${step}`,
            newData: {
                selectedGeometries: safeSelectedGeometries,
            },
        });
    }, [safeSelectedGeometries]);

    function handleGeometryClick(geometry: Geometry) {
        if (safeSelectedGeometries.includes(geometry.id)) {
            setSelectedGeometries(safeSelectedGeometries.filter((g) => g !== geometry.id));
        } else {
            setSelectedGeometries([...safeSelectedGeometries, geometry.id]);
        }
    }

    useEffect(() => {
        if (mapView && redGraphicsLayer) {
            mapView.on("click", async (event) => {
                event.stopPropagation();

                const hitTestResults = await mapView.hitTest(event);

                const existingFeature = hitTestResults.results.find(
                    (result) => (result as __esri.GraphicHit).graphic
                );

                // @ts-ignore
                const attributes = existingFeature?.graphic.attributes;

                if (attributes && attributes.type === "geometry" && attributes.geometryId) {
                    const geometry = geometries.find((g) => g.id === attributes.geometryId);
                    if (geometry) {
                        handleGeometryClick(geometry);
                    }
                }
            });
        }
    }, [safeSelectedGeometries, geometries]);

    const sortedGeometries = useMemo(() => {
        const indexMap = new Map<number, number>();
        geometries.forEach((g, i) => indexMap.set(g.id, i));

        // Create reverse index map for selected geometries (last clicked = 0, first clicked = highest)
        const selectedReverseIndexMap = new Map<number, number>();
        safeSelectedGeometries.forEach((id, i) => {
            selectedReverseIndexMap.set(id, safeSelectedGeometries.length - 1 - i);
        });

        const isSelected = (id: number) => (safeSelectedGeometries.includes(id) ? 0 : 1);
        return [...geometries].sort((a, b) => {
            const selOrder = isSelected(a.id) - isSelected(b.id);
            if (selOrder !== 0) return selOrder;

            // For selected geometries, sort by reverse index (last clicked first)
            if (safeSelectedGeometries.includes(a.id) && safeSelectedGeometries.includes(b.id)) {
                const aReverseIndex = selectedReverseIndexMap.get(a.id) ?? 0;
                const bReverseIndex = selectedReverseIndexMap.get(b.id) ?? 0;
                return aReverseIndex - bReverseIndex;
            }

            // For non-selected geometries, maintain original order
            return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
        });
    }, [geometries, safeSelectedGeometries]);

    return (
        <>
            {sortedGeometries.map((geometry) => (
                <GeometryItemCheckBox
                    key={geometry.id}
                    geometry={geometry}
                    isSelected={safeSelectedGeometries.includes(geometry.id)}
                    onMouseEnter={() => handleHoveredGeometry(geometry)}
                    onMouseLeave={handleRemoveHoveredGeometry}
                    onCheckboxClick={(e) => {
                        e.stopPropagation();
                        handleGeometryClick(geometry);
                    }}
                    onItemClick={() => {
                        setSelectedGeometries([geometry.id]);
                    }}
                />
            ))}
        </>
    );
}

