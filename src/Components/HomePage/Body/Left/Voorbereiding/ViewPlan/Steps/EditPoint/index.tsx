import { useEffect, useState } from "react";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import Buttons from "./Buttons";
import Form from "./Form";
import { useOpenTable } from "@helpers/ZustandStates/showTable";

export default function EditPoint() {
  const { clickedPoint } = useViewPlanState();
  const { pointsTable } = useOpenTable();

  const [herhalen, setHerhalen] = useState(false);
  const [omschrijving, setOmschrijving] = useState("");
  const [activiteit, setActiviteit] = useState("");
  const [organisatie, setOrganisatie] = useState("");
  const [specifiekLettenOp, setSpecifiekLettenOp] = useState("");
  const [regio_id, setRegioId] = useState("");
  const [vertrouwelijk, setVertrouwelijk] = useState(0);
  const [user_id, setUser_id] = useState(0);

  useEffect(() => {
    setHerhalen(pointsTable[clickedPoint].herhalen === 1 ? true : false);
    setOmschrijving(pointsTable[clickedPoint].omschrijving);
    setActiviteit(pointsTable[clickedPoint].activiteit_id);
    setOrganisatie(pointsTable[clickedPoint].organisatie_id);
    setSpecifiekLettenOp(pointsTable[clickedPoint].specifiek_letten_op);
    setRegioId(pointsTable[clickedPoint].regio_id);
    setVertrouwelijk(pointsTable[clickedPoint].vertrouwelijk);
    setUser_id(pointsTable[clickedPoint].user_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsTable]);

  return (
    <div className="h-full">
      <Form
        omschrijving={omschrijving}
        herhalen={herhalen}
        activiteit={activiteit}
        organisatie={organisatie}
        specifiekLettenOp={specifiekLettenOp}
        regio_id={regio_id}
        vertrouwelijk={vertrouwelijk}
        user_id={user_id}
        setHerhalen={setHerhalen}
        setOmschrijving={setOmschrijving}
        setActiviteit={setActiviteit}
        setOrganisatie={setOrganisatie}
        setSpecifiekLettenOp={setSpecifiekLettenOp}
        setRegioId={setRegioId}
        setVertrouwelijk={setVertrouwelijk}
        setUser_id={setUser_id}
      />

      <Buttons
        omschrijving={omschrijving}
        activiteit={activiteit}
        organisatie={organisatie}
        specifiekLettenOp={specifiekLettenOp}
      />
    </div>
  );
}
