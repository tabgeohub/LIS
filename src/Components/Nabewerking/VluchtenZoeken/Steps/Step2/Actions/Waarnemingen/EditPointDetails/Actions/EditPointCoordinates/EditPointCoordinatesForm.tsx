import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { InputCompNum } from "Components/HomePage/Body/Left/Common/FormComponents/InputCompNum";

type EditPointCoordinatesFormProps = {
  coordinateSystem: string;
  setCoordinateSystem: (value: string) => void;
  xcoordinaat_rd: number;
  setXCoordinaat_rd: (value: number) => void;
  ycoordinaat_rd: number;
  setYCoordinaat_rd: (value: number) => void;
  longitude: number;
  setLongitude: (value: number) => void;
  latitude: number;
  setLatitude: (value: number) => void;
};

export function EditPointCoordinatesForm(props: EditPointCoordinatesFormProps) {
  return (
    <div className="px-2 space-y-3 mt-4">
      <p className="text-gray-800 leading-3 text-[12px]">
        Wijzig de coördinaten van het punt. U kunt ook op de kaart klikken om
        de coördinaten bij te werken.
      </p>

      <SelectComp
        value={props.coordinateSystem}
        setValue={props.setCoordinateSystem}
        label="Coördinatensysteem"
        options={[
          { value: "RD", label: "RD" },
          { value: "WGS84", label: "WGS84" },
        ]}
      />

      {props.coordinateSystem === "RD" && (
        <>
          <InputCompNum
            label="X"
            value={props.xcoordinaat_rd}
            setValue={props.setXCoordinaat_rd}
          />
          <InputCompNum
            label="Y"
            value={props.ycoordinaat_rd}
            setValue={props.setYCoordinaat_rd}
          />
        </>
      )}

      {props.coordinateSystem === "WGS84" && (
        <>
          <InputCompNum
            label="Longitude"
            value={props.longitude}
            setValue={props.setLongitude}
          />
          <InputCompNum
            label="Latitude"
            value={props.latitude}
            setValue={props.setLatitude}
          />
        </>
      )}
    </div>
  );
}
