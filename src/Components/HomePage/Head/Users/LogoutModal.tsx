import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import Modal from "Components/HomePage/Body/Common/Modal";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/zustand/usePointsStore";

export default function LogoutModal({
  isOpen,
  setIsOpen,
  setOpenList,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setOpenList: (value: boolean) => void;
}) {
  const logAction = useLogAction();

  const { setUser } = useAuth();
  const { setPoints } = usePointsStore();

  const content = useContent();

  async function logout() {
    setUser({ user_id: 0, user_name: "", role: "" });
    setPoints([]);
    setIsOpen(false);
    setOpenList(false);

    const res = await fetch(`${getBackEndUrl()}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    await res.json();
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <p>{content.layout.login.logOutModal.title}</p>

      <div className="mt-4 flex gap-x-2 items-center">
        <button
          onClick={() => {
            setIsOpen(false);

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Logout modal",
            });
          }}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
        >
          {content.layout.login.logOutModal.annuleren}
        </button>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700 transition-all"
        >
          {content.layout.login.logOutModal.uitloggen}
        </button>
      </div>
    </Modal>
  );
}
