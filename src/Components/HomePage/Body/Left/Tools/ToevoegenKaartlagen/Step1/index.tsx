import { useState } from "react";
import Buttons from "./Buttons";

export default function Step1() {
  const [kaartlagen, setKaartlagen] = useState("");
  return (
    <div className="py-2">
      <p className="text-[12px] px-2">
        Zoek naar een mapserrice binnen de door de beheerder ingestelde service
        connecties. Voer (een gedeelte van) de naam in en klik op Zoeken. U kunt
        ook een geldige mapservice URL invoeren
      </p>
      <p className="text-[12px] px-2 pb-4">
        (https://servicenaam/arcgis/rest/services/foldernaam/mapservicenaam/MapServer)
      </p>

      <div className="p-2">
        <p className="text-[12px]">Zoeken naar kaartlagen</p>
        <input
          value={kaartlagen}
          onChange={(e) => setKaartlagen(e.target.value)}
          className="border-gray-200 border-[1px] rounded-md px-2 py-1 w-full"
        />
        <p className="text-[12px]">
          HTTP lagen worden niet opgenomen in de zoekresultaten als de viewer
          via HTTPS wordt aangeboden.
        </p>
      </div>

      <Buttons />
    </div>
  );
}
