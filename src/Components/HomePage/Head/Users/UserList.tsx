import { useAuth } from "@helpers/ZustandStates/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LogoutModal from "./LogoutModal";
import { useLocation } from "react-router-dom";
import useLogAction from "hooks/useLogAction";
import useGetRegios from "hooks/consts/useGetRegios";

export default function UserList({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { user } = useAuth();
  const regios = useGetRegios();

  const userListRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userListRef.current &&
        !userListRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function getRegioName(regioId: string) {
    if (regioId.split(" ")[0] === "RWS") {
      return regios.find(
        (regio) => regio.value.split(" ")[1] === regioId.split(" ")[1]
      )?.label;
    } else if (regioId.split(" ")[0] === "EXT") {
      return regios
        .find((regio) => regio.value.split(" ")[1] === regioId.split(" ")[1])
        ?.label.replace("RWS ", "EXT ");
    } else {
      return regioId;
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="p-8 fixed inset-0 z-20 grid place-items-center cursor-pointer"
        >
          <div className="relative w-full h-full">
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-white absolute top-3 right-0 w-[200px] shadow-xl cursor-default origin-top-right overflow-hidden"
            >
              <p className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                {user.user_name}
              </p>

              <p className="block capitalize px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                {getRegioName(user.role)}
              </p>

              {user.role === "admin" && location.pathname !== "/dashboard" && (
                <a
                  className="block capitalize px-4 py-2 text-sm text-blue-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  href="/dashboard"
                >
                  dashboard
                </a>
              )}

              <button
                onClick={() => {
                  setOpenLogoutModal(true);

                  logAction({
                    message: "User clicked 'Logout' button",
                    step: "User list",
                  });
                }}
                className="block px-4 py-2 text-sm text-red-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                Uitloggen
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}

      <LogoutModal
        setOpenList={setIsOpen}
        isOpen={openLogoutModal}
        setIsOpen={setOpenLogoutModal}
      />
    </AnimatePresence>
  );
}
