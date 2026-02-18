/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Form from "./Actions/Form";
import Foto from "./Actions/Foto";
import ChangePoint from "./Actions/ChangePoint";
import EditPointCoordinates from "./Actions/EditPointCoordinates";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function EditPointDetails({
  setOpenEdit,
}: {
  setOpenEdit: (value: boolean) => void;
}) {
  const [actions, setAction] = useState("form");
  const { setPoints, dbPoints } = usePointsStore();

  useEffect(() => {
    if (actions === "form") {
      setPoints(dbPoints);
    }
  }, [actions]);

  return (
    <div className="h-[70vh] overflow-auto thin-scrollbar">
      {actions === "form" && (
        <Form setOpenEdit={setOpenEdit} setAction={setAction} />
      )}

      {actions === "foto" && <Foto setAction={setAction} />}

      {actions === "changePoint" && <ChangePoint setAction={setAction} />}

      {actions === "editPointCoordinates" && (
        <EditPointCoordinates setAction={setAction} />
      )}
    </div>
  );
}
