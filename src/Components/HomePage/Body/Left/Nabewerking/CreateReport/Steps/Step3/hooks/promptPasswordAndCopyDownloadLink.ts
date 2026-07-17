import toast from "react-hot-toast";
import type { DownloadInfo } from "../types";

export async function promptPasswordAndCopyDownloadLink(input: {
  downloadInfo: DownloadInfo;
  passwordPrompt: string;
  passwordRequiredMsg: string;
  successMsg: string;
  errorFallbackMsg: string;
  setErrorMsg: (msg: string | null) => void;
  fail: (msg: string) => void;
  logSuccess: () => void;
  copyDownloadLinkAfterPassword: (input: {
    downloadInfo: DownloadInfo;
    password: string;
  }) => Promise<void>;
}): Promise<void> {
  const promptResult = window.prompt(input.passwordPrompt);
  if (typeof promptResult !== "string") return;

  const trimmed = promptResult.trim();
  if (!trimmed) {
    input.fail(input.passwordRequiredMsg);
    toast.error(input.passwordRequiredMsg);
    return;
  }

  try {
    input.setErrorMsg(null);
    await input.copyDownloadLinkAfterPassword({
      downloadInfo: input.downloadInfo,
      password: trimmed,
    });
    toast.success(input.successMsg);
    input.logSuccess();
  } catch (e: any) {
    const msg = e?.message || input.errorFallbackMsg;
    input.fail(msg);
    toast.error(msg);
  }
}
