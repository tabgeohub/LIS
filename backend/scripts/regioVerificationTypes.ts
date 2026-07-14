import { resolveRegioFilter } from "../src/helpers/queries/shared/resolveRegioFilter";

export type RegioTestReporter = {
  pass: (name: string, detail: string) => void;
  fail: (name: string, detail: string) => void;
};
export type MockReqFactory = (input: {
  roles: string[];
  query?: Record<string, string>;
}) => Parameters<typeof resolveRegioFilter>[0];
