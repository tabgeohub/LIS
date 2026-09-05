import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading: boolean;
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      className="w-full max-w-lg relative rounded-lg bg-white shadow-xl"
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) onClose();
      }}
    >
      <ConfirmModalChrome
        title="Delete User"
        onClose={onClose}
        actions={
          <>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete user{" "}
            <span className="font-medium text-gray-700">{userName}</span>? This
            action cannot be undone.
          </p>
        </div>
      </ConfirmModalChrome>
      <WizardLoadingOverlay show={loading} />
    </Modal>
  );
}
