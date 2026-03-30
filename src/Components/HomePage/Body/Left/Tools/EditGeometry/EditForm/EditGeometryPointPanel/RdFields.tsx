import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { PointFormState } from "../helpers/pointForm";
import { parseFinite, toStr } from "./coords";

export default function RdFields({
  form,
  patch,
}: {
  form: PointFormState;
  patch: (p: Partial<PointFormState>) => void;
}) {
  return (
    <div className="pt-1 border-t border-gray-100">
      <p className="text-[11px] font-medium text-gray-600 mb-2">RD (X / Y)</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">X</label>
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
          <label className="block text-[10px] text-gray-500 mb-0.5">Y</label>
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
  );
}
