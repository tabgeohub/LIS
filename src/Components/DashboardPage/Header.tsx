import Users from "Components/HomePage/Head/Users";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex justify-between">
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold"
        onClick={() => navigate("/")}
      >
        Home
      </button>

      <Users />
    </div>
  );
}
