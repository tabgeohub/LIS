export const removeColumn = (
  colName: string,
  setFunction: (value: string[] | ((prev: string[]) => string[])) => void
) => {
  setFunction((prev: string[]) => prev.filter((col) => col !== colName));
};

