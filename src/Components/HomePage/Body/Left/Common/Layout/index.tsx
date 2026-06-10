import BottomTabs from "../BottomTabs";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import ResizableSidebarPanel from "Components/HomePage/Body/Common/ResizableSidebarPanel";

export default function Layout({
  children,
  bodyStyle,
}: {
  children: React.ReactNode;
  bodyStyle: React.CSSProperties;
}) {
  const { openSideBar } = useOpeSideBarState();

  return (
    <ResizableSidebarPanel
      visible={openSideBar}
      bodyStyle={bodyStyle}
      wrapperClassName="relative"
      panelClassName="relative !h-[91%]"
      handleSide="right"
      initialWidthRatio={0.3}
      footer={
        <div className="absolute bottom-0 left-0 w-full !h-[8%] bg-gray-100">
          <BottomTabs />
        </div>
      }
    >
      {children}
    </ResizableSidebarPanel>
  );
}
