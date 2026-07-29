import { useEffect, useRef, useState } from "react";
import { useSelectedBasemapState } from "Components/HomePage/hooks/kaartlagen/useBasemapStore";
import { BASEMAP_LABELS, BASEMAP_THUMBNAILS } from "./basemapWidgetMeta";
import { BasemapWidgetPanel } from "./BasemapWidgetPanel";

function useCloseOnEscape(setOpen: (open: boolean) => void) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [setOpen]);
}

export default function BasemapWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { basemap } = useSelectedBasemapState();
  const key = basemap as keyof typeof BASEMAP_THUMBNAILS;
  useCloseOnEscape(setOpen);

  const label = BASEMAP_LABELS[key] ?? "Basemap";
  const thumbnail =
    BASEMAP_THUMBNAILS[key] ?? "/basemaps/topo-vector.png";

  return (
    <div className="absolute bottom-8 left-6 z-[10]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-white shadow-sm border p-1 flex items-center justify-center hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Basemap: ${BASEMAP_LABELS[key] ?? "select"}`}
        title={label}
      >
        <img
          src={thumbnail}
          alt={label}
          className="h-14 w-14 rounded border object-cover"
          draggable={false}
        />
      </button>
      <BasemapWidgetPanel
        open={open}
        panelRef={panelRef}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
