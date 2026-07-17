import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";
import { copyDownloadLinkAfterPassword } from "./copyLinkActions";

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

    const promptResult = window.prompt(
      content.nabewerking.createReport.step3.done.passwordPrompt
    );

    if (typeof promptResult !== "string") return;

    const trimmed = promptResult.trim();
    if (!trimmed) {
      const msg =
        content.nabewerking.createReport.step3.toasts.passwordRequired;
      fail(msg);
      toast.error(msg);
      return;
    }

    try {
      setErrorMsg(null);
      await copyDownloadLinkAfterPassword({
        downloadInfo,
        password: trimmed,
      });
      toast.success(content.nabewerking.createReport.step3.toasts.success);
      logAction({
        message: "User set password and copied link",
        step: "Third step",
      });
    } catch (e: any) {
      const msg =
        e?.message ||
        content.nabewerking.createReport.step3.toasts.error ||
        "Er is iets misgegaan bij het instellen van het wachtwoord.";
      fail(msg);
      toast.error(msg);
    }
  };

  return { handleCopyLink };
}
