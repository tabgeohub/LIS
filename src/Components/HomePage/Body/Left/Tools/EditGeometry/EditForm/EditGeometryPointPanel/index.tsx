import { useEffect, useRef, useState } from "react";
import type { SpatialReference } from "Types";
import type { PointFormState } from "../helpers/pointForm";
import CoordinateSystemSelect from "./CoordinateSystemSelect";
import Wgs84Fields from "./Wgs84Fields";
import RdFields from "./RdFields";
import useMapClickToUpdateCoordinates from "./useMapClickToUpdateCoordinates";
import useDebouncedRedPointFromInputs from "./useDebouncedRedPointFromInputs";

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

  const latestFormRef = useRef(form);
  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  const patch = (p: Partial<PointFormState>) => {
    onChange({ ...latestFormRef.current, ...p });
  };

  useMapClickToUpdateCoordinates({ patch });
  useDebouncedRedPointFromInputs({ form, delayMs: 500 });

  return (
    <div className="overflow-y-auto flex-1 thin-scrollbar pb-24 px-1">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-[13px] font-semibold text-gray-800">Punt bewerken</p>
        <p className="text-[10px] text-gray-500 mt-1">
          Klik op de kaart of vul hieronder de coördinaten in om de locatie van
          dit punt aan te passen.
        </p>
      </div>

      <div className="space-y-3">
        <CoordinateSystemSelect
          coordinateSystem={coordinateSystem}
          setCoordinateSystem={setCoordinateSystem}
        />

        {coordinateSystem === "WGS84" && <Wgs84Fields form={form} patch={patch} />}
        {coordinateSystem === "RD" && <RdFields form={form} patch={patch} />}

        <p className="text-[10px] text-gray-400 pt-2">
          Opslaan stuurt nog geen data naar de server; backend volgt.
        </p>
      </div>
    </div>
  );
}
