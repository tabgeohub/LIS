import HeaderTabs from "./Head/HeaderTabs";
import Body from "./Body";
import { useEffect, useRef, useState } from "react";
import { useTabState } from "@helpers/ZustandStates/tabState";

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { selectedPage } = useTabState();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef.current, selectedPage]);

  const bodyStyle = {
    height: `calc(100vh - ${headerHeight}px)`,
  };

  return (
    <div className="h-screen overflow-hidden">
      <div ref={headerRef}>
        <HeaderTabs />
      </div>

      <div style={bodyStyle}>
        <Body bodyStyle={bodyStyle} />
      </div>
    </div>
  );
}
