import { classNames } from "@helpers/classNames";
import { FaRegEdit } from "react-icons/fa";
import { UserType } from "Types";

export default function Table({
  setUserId,
  setChangePhase,
  users,
}: {
  setUserId: (value: number) => void;
  setChangePhase: (value: string) => void;
  users: UserType[];
}) {
  return (
    <div>
      <table className="w-full text-[12px] text-left rtl:text-right text-gray-500 rounded-lg overflow-hidden border-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] dark:shadow-[rgba(200,_200,_205,_0.21)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
        <thead className="text-[12px] bg-blue-700 text-white">
          <tr>
            <th scope="col" className="px-2 py-2">
              ID
            </th>
            <th scope="col" className="px-2 py-2">
              Gebruikersnaam
            </th>
            <th scope="col" className="px-2 py-2">
              Rol
            </th>
            <th scope="col" className="px-2 py-2 text-center">
              Wijzig Gegevens
            </th>
          </tr>
        </thead>

        <tbody>
          {users &&
            users.length > 0 &&
            users.map((user, index) => (
              <tr
                className={classNames(
                  index % 2 === 0
                    ? "bg-gray-200 hover:bg-gray-300 text-black dark:text-gray-700"
                    : "bg-gray-100 hover:bg-gray-300 text-black dark:text-gray-700"
                )}
                key={index}
              >
                <td className="px-2 py-3"> {user.user_id} </td>
                <td className="px-2 py-3">{user.user_name}</td>
                <td className="px-2 py-3">{user.role}</td>
                <td
                  className="px-2 py-3 cursor-pointer"
                  onClick={() => {
                    setUserId(user.user_id);
                    setChangePhase("editUser");
                  }}
                >
                  <FaRegEdit className="mx-auto text-lg text-primary" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
