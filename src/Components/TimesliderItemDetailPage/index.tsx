import HeaderSection from "./sections/HeaderSection";
import PlansFilterSection from "./sections/PlansFilterSection";
import MainImageSection from "./sections/MainImageSection";
import ImagesSelectionSection from "./sections/ImagesSelectionSection";

export default function TimesliderItemDetailPage() {
  return (
    <div className="flex h-screen min-h-0 flex-col bg-gray-100 text-gray-900">
      <HeaderSection />
      <PlansFilterSection />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MainImageSection />
      </div>
      <ImagesSelectionSection />
    </div>
  );
}
