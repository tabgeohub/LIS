import { IoIosArrowBack } from "react-icons/io";

export function EditUserFormActions(props: {
  loading: boolean;
  loadingRoles: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        disabled={props.loading || props.loadingRoles}
        className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {props.loading ? "Updating..." : "Update User"}
      </button>
      <button
        type="button"
        onClick={props.onBack}
        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  );
}

export function EditUserFormHeader(props: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        type="button"
        onClick={props.onBack}
        className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
      >
        <IoIosArrowBack className="w-5 h-5" />
        <span className="font-medium">All Users</span>
      </button>
    </div>
  );
}
