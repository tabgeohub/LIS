import AllUsersTable from "./AllUsersTable";
import AddUser from "./AddUser/index";
import EditUser from "./EditUser/index";
import ResetPassword from "./ResetPassword/index";
import AllRoles from "./AllRoles/index";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUsersManagementState } from "@helpers/ZustandStates/usersManagementState";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Dashboard() {
  const activeTab = useUsersManagementState((state) => state.activeTab);
  const { user } = useAuth();

  if (user.role !== "admin")
    return (
      <div className="px-10 py-6">
        <p>U bent niet geautoriseerd om deze pagina te bekijken</p>
      </div>
    );

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
          </div>
        </div>
      </div>
    </div>
  );
}
