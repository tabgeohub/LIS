import { useUsersManagementState } from "hooks/zustand/ui";

const SIDEBAR_TABS = [
  { key: "all" as const, label: "All Users" },
  { key: "create" as const, label: "Add User" },
  { key: "roles" as const, label: "All Roles" },
];

export default function Sidebar() {
  const activeTab = useUsersManagementState((state) => state.activeTab);
  const setActiveTab = useUsersManagementState((state) => state.setActiveTab);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          User Management
        </h2>
        <nav className="space-y-2" aria-label="User management sections">
          {SIDEBAR_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
