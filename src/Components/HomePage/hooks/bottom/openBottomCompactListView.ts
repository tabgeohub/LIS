type BottomCompactListSetters = {
  selectedTab: string;
  setSelectedBottomTab: (value: string) => void;
  setOpenSearchedTab: (value: boolean) => void;
  setOpenResultTab: (value: boolean) => void;
  setOpenSideBar: (value: boolean) => void;
  setOpenAllTable: (value: boolean) => void;
  setOpenTable: (value: boolean) => void;
  logAction?: (input: { message: string; step: string }) => void;
  logMessage?: string;
};

/** Open compact bottom list view (searched vs result) and close full table. */
export function openBottomCompactListView(input: BottomCompactListSetters) {
  if (input.selectedTab === "none") {
    input.setSelectedBottomTab("searched");
    input.setOpenSearchedTab(true);
  } else {
    input.setSelectedBottomTab("result");
    input.setOpenResultTab(true);
  }
  input.setOpenSideBar(true);
  input.setOpenAllTable(false);
  input.setOpenTable(false);

  if (input.logMessage && input.logAction) {
    input.logAction({
      message: input.logMessage,
      step: "Clicked table functions",
    });
  }
}
