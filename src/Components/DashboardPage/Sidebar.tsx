import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";

export default function Sidebar() {
  const activeTab = useUsersManagementState((state) => state.activeTab);
  const setActiveTab = useUsersManagementState((state) => state.setActiveTab);

  const tabs = [
    { key: "all" as const, label: "All Users" },
    { key: "create" as const, label: "Add User" },
    { key: "roles" as const, label: "All Roles" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          User Management
        </h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

