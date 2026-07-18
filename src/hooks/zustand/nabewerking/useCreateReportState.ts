import { create } from "zustand";
import { createReportSetters } from "./createReportSetters";
import type { CreateReportState } from "./createReportStateTypes";
import { createReportInitialState } from "./createReportStateValues";

export const useCreateReportState = create<CreateReportState>((set) => ({
  ...createReportInitialState,
  ...createReportSetters(set),
}));
