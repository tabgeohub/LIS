import type { Content } from "hooks/useContent";

type BannerTheme = {
  ring: string;
  icon: string;
  button: string;
  bar: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
};

export function resolveLoginBannerTheme(input: {
  kind: "notLoggedIn" | "noRole";
  content: Content;
  onLogin: () => void;
  onLogout: () => void;
}): BannerTheme {
  if (input.kind === "notLoggedIn") {
    return {
      ring: "ring-red-100",
      icon: "text-red-600",
      button:
        "bg-primary hover:bg-primary/90 focus-visible:ring-primary/50 text-white",
      bar: "bg-red-600",
      title: input.content.layout.login.notLoggedInWarning.title,
      body: input.content.layout.login.notLoggedInWarning.body,
      cta: input.content.layout.login.notLoggedInWarning.cta,
      onClick: input.onLogin,
    };
  }

  return {
    ring: "ring-amber-100",
    icon: "text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-300 text-white",
    bar: "bg-red-600",
    title: input.content.layout.login.noRoleWarning.title,
    body: input.content.layout.login.noRoleWarning.body,
    cta: input.content.layout.login.noRoleWarning.cta,
    onClick: input.onLogout,
  };
}
