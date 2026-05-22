import { useRef, useState } from "react";
import Left from "./Left";
import MapViewComp from "./MapViewComp";
import Right from "./Right";
import NotLoggedInWarning from "./Common/NotLoggedInWarning";

export default function Body({
  bodyStyle,
}: {
  bodyStyle: React.CSSProperties;
}) {
  const mapDiv = useRef<HTMLDivElement>(null);

  const [vluchtnummer, setVluchtnummer] = useState("");

  return (
    <div className="flex h-full overflow-hidden relative">
      <Left
        vluchtnummer={vluchtnummer}
        setVluchtnummer={setVluchtnummer}
        bodyStyle={bodyStyle}
      />

      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <MapViewComp mapDiv={mapDiv} vluchtnummer={vluchtnummer} />
      </div>

      <Right bodyStyle={bodyStyle} />

      <NotLoggedInWarning />
    </div>
  );
}
