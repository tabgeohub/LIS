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

function resolveLogActionFields(input: LogActionInput) {
  return {
    message: input.message || "",
    oldData: input.oldData ?? null,
    newData: input.newData ?? null,
    step: input.step ?? null,
  };
}

function resolveLogContextFields(context: LogContext) {
  return {
    userId: context.userId ?? null,
    userName: context.userName ?? null,
    userRole: context.userRole ?? null,
    tab: context.selectedTab,
    page: context.selectedPage,
  };
}

export function buildLogEntry(input: LogActionInput, context: LogContext) {
  return {
    ...resolveLogActionFields(input),
    ...resolveLogContextFields(context),
    date: new Date().toISOString(),
  };
}

export type LogEntry = ReturnType<typeof buildLogEntry>;
