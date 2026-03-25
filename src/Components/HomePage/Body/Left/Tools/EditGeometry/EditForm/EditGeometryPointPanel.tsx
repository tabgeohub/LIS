import { useEffect, useRef, useState } from "react";
import type { SpatialReference } from "Types";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import type { PointFormState } from "./helpers/pointForm";

export default function EditGeometryPointPanel({
  form,
  onChange,
}: {
  form: PointFormState;
  onChange: (next: PointFormState) => void;
}) {
  const [coordinateSystem, setCoordinateSystem] = useState<SpatialReference>(
    "WGS84"
  );

  const { mapView, redGraphicsLayer } = useMapViewState();
  const latestFormRef = useRef(form);
  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  function patch(p: Partial<PointFormState>) {
    onChange({ ...latestFormRef.current, ...p });
  }

  function parseFinite(s: string): number | undefined {
    const t = s.trim();
    if (t === "") return undefined;
    const n = Number(t.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }

  function toStr(n: number): string {
    return String(n);
  }

  useEffect(() => {
    if (!mapView) return;

    let clickHandle: __esri.Handle | null = null;
    clickHandle = mapView.on("click", (event) => {
      // Prevent other handlers from hijacking this click
      // @ts-ignore ArcGIS event may expose stopPropagation
      event.stopPropagation?.();

      const lonVal = event.mapPoint?.longitude;
      const latVal = event.mapPoint?.latitude;
      if (
        typeof lonVal !== "number" ||
        typeof latVal !== "number" ||
        !Number.isFinite(lonVal) ||
        !Number.isFinite(latVal)
      )
        return;

      const transformed = getTransformedCoordinates(
        "WGS84",
        "RD",
        lonVal,
        latVal
      );

      const pointGraphic = createPoint(lonVal, latVal);
      redGraphicsLayer?.removeAll();
      if (redGraphicsLayer) {
        redGraphicsLayer.add(pointGraphic);
      } else {
        mapView.graphics.add(pointGraphic);
      }

      patch({
        longitude: toStr(lonVal),
        latitude: toStr(latVal),
        xcoordinaat_rd: toStr(transformed.x),
        ycoordinaat_rd: toStr(transformed.y),
      });
    });

    return () => {
      clickHandle?.remove();
      redGraphicsLayer?.removeAll();
    };
  }, [mapView, redGraphicsLayer, onChange]);

  return (
    <div className="overflow-y-auto flex-1 thin-scrollbar pb-24 px-1">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-[13px] font-semibold text-gray-800">Punt bewerken</p>
        <p className="text-[10px] text-gray-500">ID: {form.id}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Omschrijving
          </label>
          <input
            type="text"
            value={form.omschrijving}
            onChange={(e) => patch({ omschrijving: e.target.value })}
            className="inputClass w-full !p-1.5 text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
            Coördinatensysteem
          </label>
          <select
            className="inputClass w-full"
            value={coordinateSystem}
            onChange={(e) =>
              setCoordinateSystem(e.target.value as SpatialReference)
            }
          >
            <option value="RD">RD</option>
            <option value="WGS84">WGS84</option>
          </select>
        </div>

        {coordinateSystem === "WGS84" && (
          <div className="pt-1 border-t border-gray-100">
            <p className="text-[11px] font-medium text-gray-600 mb-2">
              WGS84 (breedte / lengte)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">
                  Breedtegraad
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.latitude}
                  onChange={(e) => {
                    const nextLatitude = e.target.value;
                    const lonNum = parseFinite(form.longitude);
                    const latNum = parseFinite(nextLatitude);

                    if (lonNum != null && latNum != null) {
                      const { x, y } = getTransformedCoordinates(
                        "WGS84",
                        "RD",
                        lonNum,
                        latNum
                      );
                      patch({
                        latitude: nextLatitude,
                        xcoordinaat_rd: toStr(x),
                        ycoordinaat_rd: toStr(y),
                      });
                      return;
                    }

                    patch({ latitude: nextLatitude });
                  }}
                  className="inputClass w-full !p-1.5 text-[12px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">
                  Lengtegraad
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.longitude}
                  onChange={(e) => {
                    const nextLongitude = e.target.value;
                    const lonNum = parseFinite(nextLongitude);
                    const latNum = parseFinite(form.latitude);

                    if (lonNum != null && latNum != null) {
                      const { x, y } = getTransformedCoordinates(
                        "WGS84",
                        "RD",
                        lonNum,
                        latNum
                      );
                      patch({
                        longitude: nextLongitude,
                        xcoordinaat_rd: toStr(x),
                        ycoordinaat_rd: toStr(y),
                      });
                      return;
                    }

                    patch({ longitude: nextLongitude });
                  }}
                  className="inputClass w-full !p-1.5 text-[12px]"
                />
              </div>
            </div>
          </div>
        )}

        {coordinateSystem === "RD" && (
          <div className="pt-1 border-t border-gray-100">
            <p className="text-[11px] font-medium text-gray-600 mb-2">
              RD (X / Y)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">
                  X
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.xcoordinaat_rd}
                  onChange={(e) => {
                    const nextX = e.target.value;
                    const xNum = parseFinite(nextX);
                    const yNum = parseFinite(form.ycoordinaat_rd);

                    if (xNum != null && yNum != null) {
                      const { x: lon, y: lat } = getTransformedCoordinates(
                        "RD",
                        "WGS84",
                        xNum,
                        yNum
                      );
                      patch({
                        xcoordinaat_rd: nextX,
                        longitude: toStr(lon),
                        latitude: toStr(lat),
                      });
                      return;
                    }

                    patch({ xcoordinaat_rd: nextX });
                  }}
                  className="inputClass w-full !p-1.5 text-[12px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">
                  Y
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.ycoordinaat_rd}
                  onChange={(e) => {
                    const nextY = e.target.value;
                    const xNum = parseFinite(form.xcoordinaat_rd);
                    const yNum = parseFinite(nextY);

                    if (xNum != null && yNum != null) {
                      const { x: lon, y: lat } = getTransformedCoordinates(
                        "RD",
                        "WGS84",
                        xNum,
                        yNum
                      );
                      patch({
                        ycoordinaat_rd: nextY,
                        longitude: toStr(lon),
                        latitude: toStr(lat),
                      });
                      return;
                    }

                    patch({ ycoordinaat_rd: nextY });
                  }}
                  className="inputClass w-full !p-1.5 text-[12px]"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400 pt-2">
          Opslaan stuurt nog geen data naar de server; backend volgt.
        </p>
      </div>
    </div>
  );
}
