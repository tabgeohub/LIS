import { TabHeaderChrome } from "./TabHeaderChrome";
import { useTabHeaderModel } from "./useTabHeaderModel";

export default function TabHeader() {
  const model = useTabHeaderModel();
  return <TabHeaderChrome {...model} />;
}
