import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";

import ModalContainer from "./ModalContainer";
import usePopupController from "hooks/popUpModal/usePopupController";
import Header from "./Header";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import useLogAction from "hooks/useLogAction";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useContent } from "hooks/useContent";

export default function PopupModal() {
  const logAction = useLogAction();

  const { user } = useAuth();

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { openModal, setOpenModal, clickedPoint } = usePopUpState();

  usePopupController(setOpenModal);

  const showDetials = () => {
    if (user.role === "admin") return true;

    if (clickedPoint?.regio_id === user.role) return true;

    return false;
  };

  const content = useContent();

  return (
    <ModalContainer openModal={openModal}>
      <Header setOpenModal={setOpenModal} />

      {showDetials() && (
        <>
          <div className="text-blue-500 text-sm font-medium mt-4">
            <span
              onClick={() => {
                setSelectedBottomTab("editSelectedPoint");
                setOpenSideBar(true);

                logAction({
                  message: "User clicked 'Aandachtspunt wijzigen' button",
                  step: "Pop-up Point Modal",
                });
              }}
              className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
            >
              {content.bottomSection.editPointTabs.editPoint}
            </span>

            <span className="mx-2">-</span>

            <span
              onClick={() => {
                setSelectedBottomTab("deletePoint");
                setOpenSideBar(true);

                logAction({
                  message: "User clicked 'Aandachtspunt verwijderen' button",
                  step: "Pop-up Point Modal",
                });
              }}
              className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
            >
              {content.bottomSection.editPointTabs.deletePoint}
            </span>

            <span className="mx-2">-</span>

            <span
              onClick={() => {
                setSelectedBottomTab("viewPlans");
                setOpenSideBar(true);

                logAction({
                  message: "User clicked 'Waarnemingen bekijken' button",
                  step: "Pop-up Point Modal",
                });
              }}
              className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
            >
              {content.bottomSection.editPointTabs.viewObservations}{" "}
            </span>

            <span className="mx-2">-</span>

            <span
              onClick={() => {
                setSelectedBottomTab("addToPlan");
                setOpenSideBar(true);

                logAction({
                  message:
                    "User clicked 'Aandachtspunt toevoegen aan vluchtplan' button",
                  step: "Pop-up Point Modal",
                });
              }}
              className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
            >
              {content.bottomSection.editPointTabs.addToPlan}
            </span>
          </div>

          <div className="bg-gray-400/50 w-full h-[1px] my-2" />

          <p
            onClick={() => {
              setSelectedBottomTab("viewSelectedPointDetails");
              setSelectedTab("none");
              setOpenSideBar(true);

              logAction({
                message: "User clicked 'Toon objectdetails' button",
                step: "Pop-up Point Modal",
              });
            }}
            className="text-blue-500 text-sm font-medium mb-2 cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
          >
            {content.bottomSection.editPointTabs.viewDetails}{" "}
          </p>
        </>
      )}

      {!showDetials() && (
        <div className="text-red-500 text-sm font-medium mt-4 mb-4 mr-4">
          {content.pointPopUp.notAllowed}{" "}
        </div>
      )}
    </ModalContainer>
  );
}
