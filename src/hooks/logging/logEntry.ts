export type LogActionInput = {
  message: string;
  step?: string;
  oldData?: unknown;
  newData?: unknown;
};

export type LogContext = {
  userId?: number | null;
  userName?: string | null;
  userRole?: string | null;
  selectedTab: string;
  selectedPage: string;
};

export function buildLogEntry(input: LogActionInput, context: LogContext) {
  return {
    message: input.message || "",
    userId: context.userId ?? null,
    userName: context.userName ?? null,
    userRole: context.userRole ?? null,
    date: new Date().toISOString(),
    oldData: input.oldData ?? null,
    newData: input.newData ?? null,
    step: input.step ?? null,
    tab: context.selectedTab,
    page: context.selectedPage,
  };
}

export type LogEntry = ReturnType<typeof buildLogEntry>;
