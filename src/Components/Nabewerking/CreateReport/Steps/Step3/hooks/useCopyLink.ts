import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";
import { copyDownloadLinkAfterPassword } from "./copyLinkActions";
import { promptPasswordAndCopyDownloadLink } from "./promptPasswordAndCopyDownloadLink";

type UseCopyLinkInput = {
  downloadInfo: DownloadInfo | null;
  setErrorMsg: (msg: string | null) => void;
  fail: (msg: string) => void;
};

export function useCopyLink(input: UseCopyLinkInput) {
  const { downloadInfo, setErrorMsg, fail } = input;
  const content = useContent();
  const logAction = useLogAction();

  const handleCopyLink = async () => {
    if (!downloadInfo?.url) return;

    await promptPasswordAndCopyDownloadLink({
      downloadInfo,
      passwordPrompt: content.nabewerking.createReport.step3.done.passwordPrompt,
      passwordRequiredMsg:
        content.nabewerking.createReport.step3.toasts.passwordRequired,
      successMsg: content.nabewerking.createReport.step3.toasts.success,
      errorFallbackMsg:
        content.nabewerking.createReport.step3.toasts.error ||
        "Er is iets misgegaan bij het instellen van het wachtwoord.",
      setErrorMsg,
      fail,
      copyDownloadLinkAfterPassword,
      logSuccess: () =>
        logAction({
          message: "User set password and copied link",
          step: "Third step",
        }),
    });
  };

  return { handleCopyLink };
}
