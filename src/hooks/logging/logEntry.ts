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

function orEmpty(value: string | undefined): string {
  return value || "";
}

function coalesceNull<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

function resolveLogActionFields(input: LogActionInput) {
  return {
    message: orEmpty(input.message),
    oldData: coalesceNull(input.oldData),
    newData: coalesceNull(input.newData),
    step: coalesceNull(input.step),
  };
}

function resolveLogContextFields(context: LogContext) {
  return {
    userId: coalesceNull(context.userId),
    userName: coalesceNull(context.userName),
    userRole: coalesceNull(context.userRole),
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
