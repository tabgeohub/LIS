import { EditGeometryBody } from "./EditGeometryBody";
import { useEditGeometryHandlers } from "./useEditGeometryHandlers";
import { useEditGeometryModel } from "./useEditGeometryModel";

export default function EditGeometry() {
  const m = useEditGeometryModel();
  const h = useEditGeometryHandlers(m);
  return <EditGeometryBody m={m} h={h} />;
}
