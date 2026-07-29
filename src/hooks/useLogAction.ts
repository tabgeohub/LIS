import { useTabState } from "hooks/zustand/ui/tabState";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { useCreateData } from "api-hooks/mutations";
import { buildLogEntry, LogActionInput } from "./logging/logEntry";
import { enqueueLogEntry, initializeLogQueue } from "./logging/logQueue";

export default function useLogAction() {
  const { user } = useAuth();
  const { selectedPage, selectedTab } = useTabState();
  const { create } = useCreateData("/logs/podLogs");
  initializeLogQueue(create);

  return (input: LogActionInput) =>
    enqueueLogEntry(
      buildLogEntry(input, {
        userId: user?.user_id,
        userName: user?.user_name,
        userRole: user?.role,
        selectedTab,
        selectedPage,
      })
    );
}
