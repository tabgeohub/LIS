import useLogAction from "hooks/useLogAction";
import type { TabType } from "Types";
import { ActionType } from "../..";

type ButtonsProps = {
  setAction: (value: ActionType) => void;
  setValue: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
  setSelectedTab: (value: TabType) => void;
  canNext: boolean;
};

const STEP = "Second step - Edit point";

export function useWaarnemingenButtonHandlers(props: ButtonsProps) {
  const logAction = useLogAction();
  const log = (message: string) => logAction({ message, step: STEP });
  return {
    onPrev: () => {
      props.setAction("none");
      props.setValue("");
      log("User clicked 'Previous' button");
    },
    onNext: () => {
      props.setOpenEdit(true);
      log("User clicked 'Next' button");
    },
    onCancel: () => {
      props.setSelectedTab("none");
      log("User clicked 'Cancel' button");
    },
  };
}

export type { ButtonsProps as WaarnemingenButtonsProps };
