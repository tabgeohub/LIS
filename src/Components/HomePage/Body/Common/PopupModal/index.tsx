import { useTabState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useOpeSideBarState } from "hooks/zustand/ui";

import ModalContainer from "./ModalContainer";
import usePopupController from "Components/HomePage/hooks/popUpModal/usePopupController";
import Header from "./Header";
import { usePopUpState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { useAuth } from "hooks/zustand/ui";
import { useContent } from "hooks/useContent";
import { useCanEdit } from "hooks/useCanEdit";

const actionLinkClass =
  "cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all";

export default function PopupModal() {
  const logAction = useLogAction();
  const userCanEdit = useCanEdit();

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
  const labels = content.bottomSection.editPointTabs;

  const openBottomTab = (
    tab: Parameters<typeof setSelectedBottomTab>[0],
    message: string
  ) => {
    setSelectedBottomTab(tab);
    setOpenSideBar(true);
    logAction({ message, step: "Pop-up Point Modal" });
  };

  return (
    <ModalContainer openModal={openModal}>
      <Header setOpenModal={setOpenModal} />

      {showDetials() && (
        <>
          <div className="text-blue-500 text-sm font-medium mt-4">
            {userCanEdit && (
              <>
                <span
                  onClick={() =>
                    openBottomTab(
                      "editSelectedPoint",
                      "User clicked 'Aandachtspunt wijzigen' button"
                    )
                  }
                  className={actionLinkClass}
                >
                  {labels.editPoint}
                </span>

                <span className="mx-2">-</span>

                <span
                  onClick={() =>
                    openBottomTab(
                      "deletePoint",
                      "User clicked 'Aandachtspunt verwijderen' button"
                    )
                  }
                  className={actionLinkClass}
                >
                  {labels.deletePoint}
                </span>

                <span className="mx-2">-</span>
              </>
            )}

            <span
              onClick={() =>
                openBottomTab(
                  "viewPlans",
                  "User clicked 'Waarnemingen bekijken' button"
                )
              }
              className={actionLinkClass}
            >
              {labels.viewObservations}{" "}
            </span>

            {userCanEdit && (
              <>
                <span className="mx-2">-</span>

                <span
                  onClick={() =>
                    openBottomTab(
                      "addToPlan",
                      "User clicked 'Aandachtspunt toevoegen aan vluchtplan' button"
                    )
                  }
                  className={actionLinkClass}
                >
                  {labels.addToPlan}
                </span>
              </>
            )}
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
            {labels.viewDetails}{" "}
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
