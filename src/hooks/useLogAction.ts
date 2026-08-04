import { useTabState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { useCreateData } from "api-hooks/mutations";
import { buildLogContextFromSession } from "./logging/buildLogContextFromSession";
import { createLogActionHandler } from "./logging/createLogActionHandler";
import { initializeLogQueue } from "./logging/logQueue";

export default function useLogAction() {
  const { user } = useAuth();
  const { selectedPage, selectedTab } = useTabState();
  const { create } = useCreateData("/logs/podLogs");
  initializeLogQueue(create);

  return createLogActionHandler(
    buildLogContextFromSession({ user, selectedTab, selectedPage })
  );
}
