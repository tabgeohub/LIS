import { useContent } from "hooks/useContent";

export default function Tabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  const content = useContent();
  return (
    <div className="absolute top-8 bg-white w-full py-2 flex justify-center border-b-2 border-t-2">
      <div className="inline-flex rounded-md overflow-hidden">
        <button
          type="button"
          className={`px-3 py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md ${
            selectedTab === "flightplan" ? "!bg-primary !text-white" : ""
          }`}
          onClick={() => setSelectedTab("flightplan")}
        >
          {content.voorbereiding.addPointsFromPlan.tabs.flightplans}
        </button>
        <button
          type="button"
          className={`px-3 py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md ${
            selectedTab === "template" ? "!bg-primary !text-white" : ""
          }`}
          onClick={() => setSelectedTab("template")}
        >
          {content.voorbereiding.addPointsFromPlan.tabs.templates}
        </button>
      </div>
    </div>
  );
}
