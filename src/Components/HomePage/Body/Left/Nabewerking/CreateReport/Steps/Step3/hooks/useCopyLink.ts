import { useState } from "react";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { DownloadInfo } from "../types";

export function useCopyLink(
  downloadInfo: DownloadInfo | null,
  setErrorMsg: (msg: string | null) => void,
  fail: (msg: string) => void
) {
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

      // Extract filename from url: /api/file-download/:filename
      const url = new URL(downloadInfo.url, getBackEndUrl());
      const parts = url.pathname.split("/");
      const filename = parts[parts.length - 1];

      const res = await fetch(
        `${getBackEndUrl()}/api/file-download/${encodeURIComponent(
          filename
        )}/password`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: trimmed }),
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Failed to set password (${res.status})`);
      }

      await navigator.clipboard.writeText(downloadInfo.url);
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



