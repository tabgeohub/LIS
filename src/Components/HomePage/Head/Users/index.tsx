import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import UserList from "./UserList";
import useLogAction from "hooks/useLogAction";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

export default function Users() {
  const logAction = useLogAction();

  const [openList, setOpenList] = useState(false);

  const { user } = useAuth();

  const handleLogin = () => {
    logAction({
      message: "User clicked 'Log in'",
    });

    window.location.href = `${getBackEndUrl()}/auth/login`;
  };

  return (
    <div className="flex items-center gap-x-4 pr-4 relative">
      {user.user_id === 0 ? (
        <button
          onClick={handleLogin}
          className="bg-[#0070BC] px-5 py-1.5 rounded shadow-jubilation text-white hover:shadow-none hover:brightness-110 transition-all"
        >
          Inloggen
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenList((open) => !open);

            logAction({
              message: "User clicked 'User' icon",
              step: "Users",
            });
          }}
          className="bg-primary text-white p-1.5 shadow-jubilation rounded-full hover:brightness-110 transition-all hover:shadow-none"
        >
          <FaUser className="text-xl" />
        </button>
      )}

      <UserList isOpen={openList} setIsOpen={setOpenList} />
    </div>
  );
}
