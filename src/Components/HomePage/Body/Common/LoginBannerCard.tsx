import { motion } from "framer-motion";
import type { MutableRefObject } from "react";
import type { LoginBannerTheme } from "./LoginBannerTheme";
import { LoginBannerCardBody } from "./LoginBannerCardBody";

export function LoginBannerCard(props: {
  theme: LoginBannerTheme;
  primaryBtnRef: MutableRefObject<HTMLButtonElement | null>;
}) {
  const { theme, primaryBtnRef } = props;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 10, opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={`w-full max-w-md rounded-2xl bg-white/90 shadow-xl ring-1 ${theme.ring} backdrop-blur-sm`}
    >
      <div className={`h-1.5 w-full rounded-t-2xl ${theme.bar}`} />
      <LoginBannerCardBody theme={theme} primaryBtnRef={primaryBtnRef} />
    </motion.div>
  );
}
