import { useState } from "react";
import HeaderSection from "./sections/HeaderSection";
import LoginRequiredModal from "./sections/LoginRequiredModal";
import TimesliderPlansOverlay from "./sections/TimesliderPlansOverlay";
import TimesliderImageViewer from "./sections/TimesliderImageViewer";
import { useTimesliderImagePageData } from "./hooks/useTimesliderImagePageData";
import { buildTimesliderPageShell } from "./builders/buildTimesliderPageShell";

export default function TimesliderItemDetailPage() {
  const [plansSectionVisible, setPlansSectionVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const data = useTimesliderImagePageData();

  const shell = buildTimesliderPageShell({
    data,
    plansSectionVisible,
    setPlansSectionVisible,
    galleryOpen,
    setGalleryOpen,
  });

  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100 text-gray-900">
      <HeaderSection {...shell.header} />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <TimesliderPlansOverlay {...shell.plansOverlay} />
        <TimesliderImageViewer {...shell.imageViewer} />
      </div>
      <LoginRequiredModal open={shell.needsAuth} />
    </div>
  );
}
