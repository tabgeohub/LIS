import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Search from "@arcgis/core/widgets/Search";

export default function SearchWidget() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { mapView, searchWidget, setSearchWidget } = useMapViewState();
  const searchWidgetRef = useRef<HTMLDivElement | null>(null);

  const toggleSearchVisibility = () => {
    setShowSearch(!showSearch);
    if (!searchWidget && mapView && searchWidgetRef.current) {
      const newSearchWidget = new Search({
        view: mapView,
        container: searchWidgetRef.current,
        includeDefaultSources: true,
      });

      setSearchWidget(newSearchWidget);

      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    if (!searchWidget) return;

    searchWidget.on("search-complete", (event) => {
      if (event.results && event.results.length > 0) {
        // @ts-ignore
        setSelectedLocation(event.results[0].results[0].feature.geometry);
      }
    });

    mapView?.goTo({
      target: selectedLocation,
      zoom: 15,
    });
  };

  return (
    <div>
      <button onClick={toggleSearchVisibility} className="gray-button">
        <IoSearch className="text-lg" />
      </button>
      <div
        ref={searchWidgetRef}
        style={{
          position: "absolute",
          zIndex: 1,
          display: showSearch ? "block" : "none",
          top: "40px",
        }}
      ></div>
    </div>
  );
}
