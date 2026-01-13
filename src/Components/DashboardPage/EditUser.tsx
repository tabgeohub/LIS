import { useState } from "react";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useUpdateData } from "utils/useUpdateData";
import { UserType } from "Types";
import useGetRegios from "hooks/consts/useGetRegios";

export default function EditUser({
  userId,
  users,
  setChangePhase,
  refetch,
}: {
  userId: number;
  users: UserType[];
  setChangePhase: (value: string) => void;
  refetch: () => void;
}) {
  const user = users.find((user) => user.user_id === userId);
  const [name, setName] = useState(user?.user_name);
  const [role, setRole] = useState(user?.role);

  const regios = useGetRegios();

  const { update } = useUpdateData(`/users`);

  const editUser = () => {
    const attributes = {
      user_id: user?.user_id,
      user_name: name,
      role: role,
    };

    update(attributes, () => {
      refetch();
      setChangePhase("");
    });
  };

  return (
    <div className="bg-gray-50/90 relative lg:w-[700px] p-8 mx-auto rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-mono3">
      <p className="text-2xl font-bold text-primary">Account wijzigen</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <InputComp value={name!} label="Gebruikersnaam" setValue={setName} />

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

      <div className="mt-6 flex justify-center">
        <div className="w-full sm:w-[50%]">
          <button
            className="bg-blue-700 w-full !text-center px-4 py-2 font-bold text-white rounded-full"
            onClick={editUser}
          >
            <span className="mx-auto">Opslaan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
