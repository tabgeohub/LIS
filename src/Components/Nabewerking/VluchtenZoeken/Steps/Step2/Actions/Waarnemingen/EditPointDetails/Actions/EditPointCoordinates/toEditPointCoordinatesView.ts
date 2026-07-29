import type { FinishedPointType } from "Types/finished_plans";
import type { EditPointCoordinateValues } from "./useEditPointCoordinateInputs";

type EditPointCoordinateInputsApi = EditPointCoordinateValues & {
  setCoordinateSystem: (value: string) => void;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
};

export function toEditPointCoordinatesView(input: {
  selectedPoint: FinishedPointType | null;
  loading: boolean;
  inputs: EditPointCoordinateInputsApi;
  handleSubmit: () => void;
}) {
  return {
    selectedPoint: input.selectedPoint,
    loading: input.loading,
    coordinateSystem: input.inputs.coordinateSystem,
    setCoordinateSystem: input.inputs.setCoordinateSystem,
    xcoordinaat_rd: input.inputs.xcoordinaat_rd,
    setXCoordinaat_rd: input.inputs.setXCoordinaat_rd,
    ycoordinaat_rd: input.inputs.ycoordinaat_rd,
    setYCoordinaat_rd: input.inputs.setYCoordinaat_rd,
    longitude: input.inputs.longitude,
    setLongitude: input.inputs.setLongitude,
    latitude: input.inputs.latitude,
    setLatitude: input.inputs.setLatitude,
    handleSubmit: input.handleSubmit,
  };
}
