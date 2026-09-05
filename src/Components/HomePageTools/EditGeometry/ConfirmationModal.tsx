import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";
import { Geometry } from "hooks/features";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { geometryDisplayName } from "./EditForm/helpers/labels";

interface ConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedGeometry: Geometry | null;
  handleDelete: () => void;
  loading: boolean;
  isDeleting: boolean;
}

export default function ConfirmationModal({
  isOpen,
  setIsOpen,
  selectedGeometry,
  handleDelete,
  loading,
  isDeleting,
}: ConfirmationModalProps) {
  const logAction = useLogAction();
  const content = useContent();
  const label = selectedGeometry
    ? geometryDisplayName(selectedGeometry)
    : "deze geometrie";

  return (
    <Modal
      className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <ConfirmModalChrome
        title={content.common.verwijderen}
        onClose={() => setIsOpen(false)}
        actions={
          <>
            <button type="button" onClick={handleDelete} className="gray-button">
              {content.common.ok}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logAction({
                  message: "User clicked 'Cancel' in delete confirmation modal",
                  step: "Edit Geometry",
                });
              }}
              className="gray-button"
            >
              {content.common.annuleren}
            </button>
          </>
        }
      >
        <p className="text-[14px] text-gray-700">
          Weet je zeker dat je <strong>{label}</strong> wilt verwijderen?
        </p>
      </ConfirmModalChrome>
      <WizardLoadingOverlay show={loading || isDeleting} variant="stacked" />
    </Modal>
  );
}
