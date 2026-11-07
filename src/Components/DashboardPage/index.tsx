import AllUsersTable from "./AllUsersTable";
import AddUser from "./AddUser/index";
import EditUser from "./EditUser/index";
import ResetPassword from "./ResetPassword/index";
import AllRoles from "./AllRoles/index";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FlightMigration from "./FlightMigration";
import { useUsersManagementState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { getBackEndUrl } from "@helpers/http/getBackEndUrl";

export default function Dashboard() {
  const activeTab = useUsersManagementState((state) => state.activeTab);
  const { user } = useAuth();

  if (user.role !== "admin") {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const isMigrationHandoff = new URLSearchParams(window.location.search).has("migrationExport");
    return (
      <div className="px-10 py-6">
        <p>U bent niet geautoriseerd om deze pagina te bekijken.</p>
        {isMigrationHandoff && <a className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white" href={`${getBackEndUrl()}/auth/login?return_to=${encodeURIComponent(returnTo)}`}>Sign in to continue migration</a>}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="mx-auto px-4 py-8">
            {activeTab === "all" && <AllUsersTable />}
            {activeTab === "create" && <AddUser />}
            {activeTab === "edit" && <EditUser />}
            {activeTab === "reset" && <ResetPassword />}
            {activeTab === "roles" && <AllRoles />}
            {activeTab === "migrations" && <FlightMigration />}
          </div>
        </div>
      </div>
    </div>
  );
}
