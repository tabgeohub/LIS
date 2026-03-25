import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { PointFormState } from "../helpers/pointForm";
import { parseFinite, toStr } from "./coords";

export default function Wgs84Fields({
  form,
  patch,
}: {
  form: PointFormState;
  patch: (p: Partial<PointFormState>) => void;
}) {
  return (
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
  );
}
