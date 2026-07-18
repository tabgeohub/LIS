import { motion } from "framer-motion";
import type { MutableRefObject } from "react";
import { LoginBannerCard } from "./LoginBannerCard";
import type { LoginBannerTheme } from "./LoginBannerTheme";

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export function LoginBannerOverlay(props: {
  theme: LoginBannerTheme;
  primaryBtnRef: MutableRefObject<HTMLButtonElement | null>;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={props.theme.title}
      className="fixed inset-0 z-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayVariants}
    >
      <div className="absolute inset-0 bg-white/65 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgba(255,255,255,0.6),transparent_70%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <LoginBannerCard
          theme={props.theme}
          primaryBtnRef={props.primaryBtnRef}
        />
      </div>
    </motion.div>
  );
}
