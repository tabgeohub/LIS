import { useState } from "react";
import { useCreateData } from "utils/useCreateData";
import useGetRegios from "hooks/consts/useGetRegios";

export default function AddUser({
  setChangePhase,
  refetch,
}: {
  setChangePhase: (value: string) => void;
  refetch: () => void;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const regios = useGetRegios();

  const { create } = useCreateData(`/users`);

  const addUser = () => {
    const attributes = {
      user_name: name,
      password: password,
      role: role,
    };

    create(attributes, () => {
      refetch();
      setChangePhase("");
    });
  };

  return (
    <div className="bg-gray-50/90 relative w-full lg:max-w-2xl p-4 sm:p-8 mx-auto rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  dark:bg-mono3">
      <div className="space-y-2 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="labelClass">Gebruikersnaam</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="inputClass"
            />
          </div>

          <div>
            <label className="labelClass">Wachtwoord</label>
            <input
              type="password"
              name="password"
              className="inputClass"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="labelClass">Rol</label>
            <select
              className="inputClass"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {regios.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label === "ALL" ? "Admin" : item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="w-full sm:w-[50%]">
          <button
            className="bg-blue-700 w-full !text-center px-4 py-2 font-bold text-white rounded-full"
            onClick={() => addUser()}
            disabled={role === "" || name === "" || password === ""}
          >
            <span className="mx-auto">Verzenden</span>
          </button>
        </div>
      </div>
    </div>
  );
}
