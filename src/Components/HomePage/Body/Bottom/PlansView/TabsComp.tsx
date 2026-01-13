import { classNames } from "@helpers/classNames";

export default function TabsComp({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tabValue: string) => void;
}) {
  const tabsList = [
    { label: "Details", value: "Details" },
    { label: "Gps_tracks (related)", value: "Gps_tracks" },
    { label: "Gps_locaties (related)", value: "Gps_locaties" },
    { label: "Waypoints (related)", value: "Waypoints" },
    { label: "Tracks (related)", value: "Tracks" },
  ];

  return (
    <div className="bg-gray-200">
      <div className="flex gap-x-0.5">
        {tabsList.map((tab) => (
          <div
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={classNames(
              "flex justify-between px-2 py-1 text-xs border border-gray-300 rounded-t-lg cursor-pointer",
              activeTab === tab.value
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-700"
            )}
          >
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
