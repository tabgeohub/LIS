import type { LogContext } from "./logEntry";

type LogSessionUser = {
  user_id?: number | null;
  user_name?: string | null;
  role?: string | null;
} | null | undefined;

export function buildLogContextFromSession(input: {
  user: LogSessionUser;
  selectedTab: string;
  selectedPage: string;
}): LogContext {
  return {
    userId: input.user?.user_id,
    userName: input.user?.user_name,
    userRole: input.user?.role,
    selectedTab: input.selectedTab,
    selectedPage: input.selectedPage,
  };
}
