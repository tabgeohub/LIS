import { useState } from "react";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

export default function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    // Clear user state
    setUser({ user_id: 0, user_name: "", role: "" });

    try {
      const res = await fetch(`${getBackEndUrl()}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      await res.json();

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if logout fails
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          {isLoggingOut ? (
            <>
              <CgSpinner className="animate-spin h-4 w-4" />
              Logging out...
            </>
          ) : (
            <>
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
