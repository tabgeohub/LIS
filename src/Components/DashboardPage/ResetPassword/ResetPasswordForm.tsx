import PasswordConfirmFields from "../shared/PasswordConfirmFields";

export function ResetPasswordForm(props: {
  username?: string;
  formData: { password: string; confirmPassword: string };
  loading: boolean;
  onBack: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Reset Password for {props.username}
      </h2>
      <form onSubmit={props.onSubmit} className="space-y-6">
        <PasswordConfirmFields
          password={props.formData.password}
          confirmPassword={props.formData.confirmPassword}
          onChange={props.onChange}
          passwordLabel="New Password *"
        />
        <ResetPasswordActions loading={props.loading} onBack={props.onBack} />
      </form>
    </div>
  );
}

function ResetPasswordActions(props: {
  loading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        disabled={props.loading}
        className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {props.loading ? "Resetting..." : "Reset Password"}
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
