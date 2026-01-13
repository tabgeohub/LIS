/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect } from "react";
import useLogAction from "hooks/useLogAction";

export const LayerItem = ({
  layer,
  isDisabled = false,
  onLayerChange,
}: {
  layer: {
    id: string;
    title: string;
    layer: __esri.Layer | __esri.FeatureLayer | __esri.MapImageLayer | null;
    checked: boolean;
    icon?: any;
  };
  isDisabled?: boolean;
  onLayerChange: (id: string, checked: boolean) => void;
}) => {
  const { mapView, map } = useMapViewState();
  const logAction = useLogAction();

  // case-insensitive title match
  const titlesEqual = (a?: string, b?: string) =>
    (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

  // find an existing layer in the map by title (returns the map's instance)
  const findLayerByTitle = (title: string) => {
    const layers = mapView?.map?.layers;
    if (!layers) return null;

    // ArcGIS Collection supports forEach/at; we can iterate safely
    for (let i = 0; i < layers.length; i++) {
      const candidate = layers.getItemAt(i);
      if (titlesEqual(candidate?.title!, title)) return candidate;
    }
    return null;
  };

  function handleToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    onLayerChange(layer.id, checked);

    if (!layer.layer) return;

    const existing = findLayerByTitle(layer.title);

    if (checked) {
      // only add if a layer with the same title isn't already on the map
      if (!existing) {
        map?.add(layer.layer);

        logAction({
          message: `User added layer '${layer.title}' to the map`,
          step: "Kaartlegende",
        });
      }
    } else {
      // remove the actual instance that is already on the map (found by title)
      if (existing) {
        map?.remove(existing);

        logAction({
          message: `User removed layer '${layer.title}' from the map`,
          step: "Kaartlegende",
        });
      }
    }
  }

  // if disabled, ensure any matching layer by title is removed
  useEffect(() => {
    if (!layer.layer || !isDisabled) return;

    const existing = findLayerByTitle(layer.title);
    if (existing) {
      map?.remove(existing);
    }
  }, [isDisabled]);

  return (
    <div
      className={`flex relative items-center justify-between border-b px-3 hover:bg-gray-100 transition-colors ${
        isDisabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
      }`}
    >
      <span className="w-[26px]" />

      <label
        htmlFor={layer.title}
        className="flex items-center cursor-pointer gap-2 py-2 w-full"
      >
        <input
          type="checkbox"
          id={layer.title}
          checked={layer.checked}
          disabled={isDisabled}
          onChange={handleToggle}
        />

        {layer.icon && <div className="min-w-[14px]">{layer.icon}</div>}

        <span>{layer.title}</span>
      </label>
    </div>
  );
};
