import { Dialog, DialogPanel } from "@headlessui/react";

export default function Modal({
  isOpen,
  setIsOpen,
  children,
  unclosed = false,
  className = "w-full max-h-[90vh] max-w-md rounded-xl bg-white p-6 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0",
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
  unclosed?: boolean;
  className?: string;
}) {
  function close() {
    if (unclosed) return;

    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={close}
    >
      <div className="fixed inset-0 z-[1000] bg-white/20 backdrop-blur-sm w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel transition className={className}>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
