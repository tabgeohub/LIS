type PasswordConfirmFieldsProps = {
  password: string;
  confirmPassword: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordLabel?: string;
  confirmLabel?: string;
};

export default function PasswordConfirmFields({
  password,
  confirmPassword,
  onChange,
  passwordLabel = "Password *",
  confirmLabel = "Confirm Password *",
}: PasswordConfirmFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {passwordLabel}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={passwordLabel.replace(" *", "")}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {confirmLabel}
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={confirmLabel.replace(" *", "")}
        />
      </div>
    </div>
  );
}
