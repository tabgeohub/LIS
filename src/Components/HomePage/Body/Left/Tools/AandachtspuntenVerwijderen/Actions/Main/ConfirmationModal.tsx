import Modal from "Components/HomePage/Body/Common/Modal";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { IoMdClose } from "react-icons/io";
import { EnrichedPointType } from "Types";
import useLogAction from "hooks/useLogAction";

interface ConfirmationModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    selectedPoint: EnrichedPointType | null;
    handleDelete: () => void;
    loading: boolean;
    isDeleting: boolean;
    content: any;
}

export default function ConfirmationModal({
    isOpen,
    setIsOpen,
    selectedPoint,
    handleDelete,
    loading,
    isDeleting,
    content,
}: ConfirmationModalProps) {
    const logAction = useLogAction();

    return (
        <Modal
            className="w-full max-w-md rounded relative bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="">
                <div className="flex justify-between items-center px-2 py-2">
                    <p></p>

                    <p className="text-gray-500 text-[16px]">
                        {content.common.verwijderen}
                    </p>

                    <button onClick={() => setIsOpen(false)}>
                        <IoMdClose className="text-gray-500 text-lg" />
                    </button>
                </div>

                <div className="w-full h-0.5 bg-gray-300" />

                <div className="py-2 px-3">
                    <p className="text-[14px] text-gray-700">
                        Weet je zeker dat je <strong>{selectedPoint?.omschrijving}</strong> wilt verwijderen?
                    </p>

                    <div className="flex justify-end mt-6 gap-x-2">
                        <button onClick={handleDelete} className="gray-button">
                            {content.common.ok}
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false);

                                logAction({
                                    message: "User clicked 'Cancel' in delete confirmation modal",
                                    step: "Main step",
                                });
                            }}
                            className="gray-button"
                        >
                            {content.common.annuleren}
                        </button>
                    </div>
                </div>
            </div>

            {(loading || isDeleting) && (
                <div className="absolute top-0 left-0 w-full h-full ">
                    <div className="relative h-full w-full">
                        <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />

                        <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
                            <LoadingBars />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

