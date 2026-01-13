/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn } from "react-icons/fi";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useContent } from "hooks/useContent";

type BannerKind = "notLoggedIn" | "noRole" | null;

export default function NotLoggedInWarning() {
  const { user, setUser } = useAuth();
  const [show, setShow] = useState(true);
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  const kind: BannerKind = useMemo(() => {
    if (user.user_id === 0) return "notLoggedIn";
    if (user.role === undefined) return "noRole";
    return null;
  }, [user.user_id, user.role]);

  function login() {
    window.location.href = `${getBackEndUrl()}/auth/login`;
  }

  async function logout() {
    setUser({ user_id: 0, user_name: "", role: "" });
    const res = await fetch(`${getBackEndUrl()}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    try {
      await res.json();
    } catch (_) {
      // ignore
    }
  }

  useEffect(() => {
    const shouldShow = !!kind;
    setShow(shouldShow);

    // Lock scroll while overlay is shown
    if (shouldShow) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [kind]);

  useEffect(() => {
    if (!show) return;
    // focus primary action button when visible
    const id = requestAnimationFrame(() => {
      primaryBtnRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [show]);

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  const content = useContent();

  // theme per kind
  const theme = useMemo(() => {
    if (kind === "notLoggedIn") {
      return {
        accent: "",
        ring: "ring-red-100",
        icon: "text-red-600",
        button:
          "bg-primary hover:bg-primary/90 focus-visible:ring-primary/50 text-white",
        chip: "bg-red-50 text-red-700",
        bar: "bg-red-600",
        title: content.layout.login.notLoggedInWarning.title,
        body: content.layout.login.notLoggedInWarning.body,
        cta: content.layout.login.notLoggedInWarning.cta,
        onClick: login,
      };
    }
    return {
      accent: "",
      ring: "ring-amber-100",
      icon: "text-red-600",
      button:
        "bg-red-600 hover:bg-red-700 focus-visible:ring-red-300 text-white",
      chip: "bg-amber-50 text-amber-800",
      bar: "bg-red-600",
      title: content.layout.login.noRoleWarning.title,
      body: content.layout.login.noRoleWarning.body,
      cta: content.layout.login.noRoleWarning.cta,
      onClick: logout,
    };
  }, [kind]);

  return (
    <AnimatePresence>
      {show && kind && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={theme.title}
          className="fixed inset-0 z-50"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
        >
          <div className="absolute inset-0 bg-white/65 backdrop-blur-xl" />
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.accent} mix-blend-multiply`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgba(255,255,255,0.6),transparent_70%)]" />

          <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className={`w-full max-w-md rounded-2xl bg-white/90 shadow-xl ring-1 ${theme.ring} backdrop-blur-sm`}
            >
              <div className={`h-1.5 w-full rounded-t-2xl ${theme.bar}`} />

              <div className="px-6 py-6">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
                  <FiLogIn className={`h-6 w-6 ${theme.icon}`} />
                </div>

                <h2 className="text-center text-lg font-semibold text-gray-900">
                  {theme.title}
                </h2>
                <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                  {theme.body}
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    ref={primaryBtnRef}
                    onClick={theme.onClick}
                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium shadow focus-visible:outline-none focus-visible:ring-2 ${theme.button}`}
                  >
                    {theme.cta}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
