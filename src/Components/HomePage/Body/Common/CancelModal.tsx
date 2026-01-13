import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";

export default function CancelModal({
  isOpen,
  setIsOpen,
  handleCancel,
  handleSubmit,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleCancel: () => void;
  handleSubmit: () => void;
}) {
  const logAction = useLogAction();

  const content = useContent();

  function close() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-black">
              {content.common.cancelModal.title}?
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-black">
              {content.common.cancelModal.message}
            </p>
            <div className="mt-4 flex gap-x-2 items-center">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={() => {
                  handleSubmit();
                  logAction({
                    message: "User clicked 'Confirm' button",
                    step: "Cancel modal",
                  });
                }}
              >
                {content.common.confirm}
              </Button>

              <Button
                className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700 transition-all"
                onClick={() => {
                  handleCancel();
                  logAction({
                    message: "User clicked 'Close' button",
                    step: "Cancel modal",
                  });
                }}
              >
                {content.common.close}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
