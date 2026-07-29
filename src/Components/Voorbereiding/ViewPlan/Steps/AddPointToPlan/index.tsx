/* eslint-disable react-hooks/exhaustive-deps */
import { AddPointToPlanView } from "./AddPointToPlanView";
import { useAddPointToPlanModel } from "./useAddPointToPlanModel";

export default function AddPointToPlan() {
  return <AddPointToPlanView model={useAddPointToPlanModel()} />;
}
