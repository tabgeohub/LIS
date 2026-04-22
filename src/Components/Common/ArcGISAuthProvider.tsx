import { ReactNode, useEffect, useState } from "react";
import { refreshArcGISUserToken } from "@helpers/tokens/ArcGISUserToken";

type Props = {
  children: ReactNode;
};

export default function ArcGISAuthProvider({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        cleanup = await refreshArcGISUserToken({
          useProxy: true,
          refreshEveryMs: 5 * 60 * 1000,
          extraServers: [],
        });
        setReady(true);
      } catch (error) {
        console.error("ArcGIS auth bootstrap failed", error);
        setReady(true);
      }
    })();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}

