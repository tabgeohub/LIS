import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiLogIn } from "react-icons/fi";
import { useContent } from "hooks/useContent";
import { getKeycloakLoginUrlWithReturn } from "@helpers/getLoginUrlWithReturn";

type Props = {
  open: boolean;
};

export default function LoginRequiredModal({ open }: Props) {
  const content = useContent();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goToLogin = () => {
    window.location.href = getKeycloakLoginUrlWithReturn(
      `${window.location.pathname}${window.location.search}`
    );
  };

  const title = content.layout.login.notLoggedInWarning.title;
  const body = content.layout.login.notLoggedInWarning.body;
  const cta = content.layout.login.notLoggedInWarning.cta;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="timeslider-login-modal-title"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full rounded-t-2xl bg-primary" />
              <div className="px-6 py-6">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-inner">
                  <FiLogIn className="h-6 w-6 text-primary" />
                </div>
                <h2
                  id="timeslider-login-modal-title"
                  className="text-center text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
                <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                  {body}
                </p>
                <p className="mt-2 text-center text-xs text-gray-500">
                  {content.layout.login.notLoggedInWarning.afterLoginReturnHint}
                </p>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:bg-primary/90"
                >
                  {cta}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
