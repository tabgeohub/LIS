import { FiLogIn } from "react-icons/fi";
import type { MutableRefObject } from "react";
import type { LoginBannerTheme } from "./LoginBannerTheme";

export function LoginBannerCardBody(props: {
  theme: LoginBannerTheme;
  primaryBtnRef: MutableRefObject<HTMLButtonElement | null>;
}) {
  const { theme, primaryBtnRef } = props;
  return (
    <div className="px-6 py-6 space-y-4">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
        <FiLogIn className={`h-6 w-6 ${theme.icon}`} />
      </div>
      <h2 className="text-center text-lg font-semibold text-gray-900">
        {theme.title}
      </h2>
      <p className="text-center text-sm leading-6 text-gray-600">{theme.body}</p>
      <button
        ref={primaryBtnRef}
        onClick={theme.onClick}
        className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium shadow focus-visible:outline-none focus-visible:ring-2 ${theme.button}`}
      >
        {theme.cta}
      </button>
    </div>
  );
}
