import type { SpatialReference } from "Types";

type CoordinateFieldsProps = {
  coordinateSystem: SpatialReference;
  setCoordinateSystem: (value: SpatialReference) => void;
  xCoord: number;
  setXCoord: (value: number) => void;
  yCoord: number;
  setYCoord: (value: number) => void;
  longitude: number;
  setLongitude: (value: number) => void;
  latitude: number;
  setLatitude: (value: number) => void;
  labels: {
    coordinateSystem: string;
    coordinates: readonly (string | undefined)[];
    x: string;
    y: string;
    longitude: string;
    latitude: string;
  };
  onCoordinateSystemChange?: (value: SpatialReference) => void;
  onYChange?: (value: number) => void;
};

function NumberField(props: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">{props.label}</p>
      <input
        className="inputClass col-span-4 !w-[60%]"
        type="number"
        value={props.value}
        onChange={(event) => props.setValue(Number(event.target.value))}
      />
    </div>
  );
}

export default function CoordinateFields(props: CoordinateFieldsProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">{props.labels.coordinateSystem}:</p>
        <select
          className="col-span-4 inputClass"
          value={props.coordinateSystem}
          onChange={(event) => {
            const value = event.target.value as SpatialReference;
            props.setCoordinateSystem(value);
            props.onCoordinateSystemChange?.(value);
          }}
        >
          <option value="RD">{props.labels.coordinates[0]}</option>
          <option value="WGS84">{props.labels.coordinates[1]}</option>
        </select>
      </div>

      {props.coordinateSystem === "RD" ? (
        <>
          <NumberField label={props.labels.x} value={props.xCoord} setValue={props.setXCoord} />
          <NumberField
            label={props.labels.y}
            value={props.yCoord}
            setValue={(value) => {
              props.setYCoord(value);
              props.onYChange?.(value);
            }}
          />
        </>
      ) : (
        <>
          <NumberField
            label={props.labels.longitude}
            value={props.longitude}
            setValue={props.setLongitude}
          />
          <NumberField
            label={props.labels.latitude}
            value={props.latitude}
            setValue={props.setLatitude}
          />
        </>
      )}
    </div>
  );
}
