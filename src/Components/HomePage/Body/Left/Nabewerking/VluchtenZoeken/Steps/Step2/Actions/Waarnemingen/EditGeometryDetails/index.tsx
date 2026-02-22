/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Form from "./Actions/Form";
import Foto from "./Actions/Foto";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export default function EditGeometryDetails({
  setOpenEdit,
}: {
  setOpenEdit: (value: boolean) => void;
}) {
  const [actions, setAction] = useState("form");
  const { resetFeatures } = useResetFeatures();

  useEffect(() => {
    if (actions === "form") {
      resetFeatures();
    }
  }, [actions]);

  return (
    <div className="h-[70vh] overflow-auto thin-scrollbar">
      {actions === "form" && (
        <Form setOpenEdit={setOpenEdit} setAction={setAction} />
      )}

      {actions === "foto" && <Foto setAction={setAction} />}
    </div>
  );
}

