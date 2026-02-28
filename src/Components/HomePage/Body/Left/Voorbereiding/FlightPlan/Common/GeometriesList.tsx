import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { TbLine, TbPolygon } from "react-icons/tb";
import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import useDrawYellowGeometries from "hooks/hover-click-handlers/useDrawYellowGeometries";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";



// Hook for geometry click (similar to usePointClick)
function useGeometryClick(selectedGeometryIds: number[], allGeometries: Geometry[], herhalenFilter?: boolean | null) {
    // Use allGeometries to find selected geometries, not just the filtered list
    // This ensures selected geometries are found even if they're not in the current filter
    useDrawYellowGeometries({
        selectedGeometryIds: selectedGeometryIds, // Pass IDs directly - the effect will handle re-rendering when they change
        geometries: [], // Not used in the effect, but kept for API compatibility
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
    const { mapView, redGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();
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

    // Pass selected geometry IDs directly to avoid unnecessary object conversions
    // This ensures the effect only runs when the selection actually changes
    useGeometryClick(
        safeSelectedGeometries, // Pass IDs directly
        dbGeometries, // Use all geometries for lookup
        herhalenFilter // Pass herhalen filter to only draw matching geometries
    );
    const { handleHoveredGeometry, handleRemoveHoveredGeometry } = useGeometryHover();

    // Render blue geometries for non-selected ones
    // This effect runs after the global renderer to ensure our filtered rendering takes precedence
    useEffect(() => {
        if (!validateMapView(mapView, geometriesGraphicsLayer)) return;

        if (!geometries.length) {
            geometriesGraphicsLayer?.removeAll();
            return;
        }

        const graphics: Graphic[] = [];

        geometries.forEach((geometry) => {
            // Skip selected geometries - they will be rendered in yellow
            if (safeSelectedGeometries.includes(geometry.id)) return;

            const graphic = createGeometryGraphic(geometry);
            if (graphic) {
                graphics.push(graphic);
            }
        });

        replaceGraphics(geometriesGraphicsLayer!, graphics);
    }, [geometries, safeSelectedGeometries, mapView, geometriesGraphicsLayer]);

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

