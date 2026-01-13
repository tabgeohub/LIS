import { useState } from "react";
import { ParentItem } from "../Common/ParentItem";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";

export default function Overig() {
  const [parentChecked, setParentChecked] = useState(false);

  return (
    <>
      <ParentItem
        title="Overig"
        checked={parentChecked}
        setChecked={setParentChecked}
      >
        <div className="pl-8">
          <Section1 parentChecked={parentChecked} />

          <Section2 parentChecked={parentChecked} />

          <Section3 parentChecked={parentChecked} />

          <Section4 parentChecked={parentChecked} />
        </div>
      </ParentItem>
    </>
  );
}
