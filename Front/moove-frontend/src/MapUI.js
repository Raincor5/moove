import React, { useState, useEffect } from "react";
import './MapUI.scss';
import { useMap } from 'react-leaflet';

function MapUI() {
    // Define Misc button states.
    const [isMiscOpen, setIsMiscOpen] = useState(false);
    // Define Leaflet map constant.
    const map = useMap();
    // Define deal type switch button states.
    const [dealType, setDealType] = useState("To Rent");
    // Define zoom level states. (For the zoom scroll bar)
    const [zoomLevel, setZoomLevel] = useState(map.getZoom());
    // Define search box and filtering states.
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    // Toggle the Misc button's popup section.
    const toggleMiscSection = (event) => {
        event.stopPropagation();
        setIsMiscOpen(!isMiscOpen);
    };

    // Function to handle the change of the zoom level of the zoom scroll bar.
    const handleZoomChange = (event) => {
        const newZoomLevel = +event.target.value;
        map.setZoom(+event.target.value);
        setZoomLevel(newZoomLevel);
    };


    // Deal type if condition.
    const toggleDealType = () => {
        setDealType(dealType === "To Rent" ? "For Sale" : "To Rent");
    };


    // Zoom level listener.
    useEffect(() => {
        const onZoomEnd = () => {
          setZoomLevel(map.getZoom());
        };
      
        map.on('zoomend', onZoomEnd);
      
        return () => {
          map.off('zoomend', onZoomEnd);
        };
      }, [map]);


    // Search bar ccontroller.
    const toggleSearchVisibility = () => {
        setIsSearchVisible(!isSearchVisible);
        if (isFilterVisible) setIsFilterVisible(false); // Hide filters if search is closed
    };

    // Perform search functions
    const handleSearch = () => {
        // Performing search using searchTerm
        console.log("Searching for: ", searchTerm);
        // A place to call an API or filter data based on searchTerm
        //
    };
    
    return (
        <div className="map-ui">
            {/* Misc button */}
            <button className="misc-button" onClick={toggleMiscSection}>Misc</button>
            {isMiscOpen && (
                <div className="misc-section">
                <p>Miscellaneous content</p>
                </div>
            )}

            {/* Zoom scroll */}
            <div className="zoom-scroll">
                <input
                type="range"
                min="0"
                max="18" // Adjust max zoom level as needed
                defaultValue={map.getZoom()}
                value={zoomLevel}
                onChange={handleZoomChange}
                className="zoom-range"
                orient="vertical" // For browsers that support vertical range inputs
                />
            </div>

            {/* Deal type switch button */}
            <div className="deal-switch">
                <button className="deal-switch-type" onClick={toggleDealType}>
                    {dealType}
                </button>
            </div>

            <div className="searchArea">
                <button onClick={toggleSearchVisibility} className="search-toggle-button">
                    Search
                </button>
                {isSearchVisible && (
                    <>
                        <div className="search-box">
                            <input 
                            type="text" 
                            placeholder="Enter location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                    setSearchTerm("");
                                }
                            }}
                            />
                            <button onClick={handleSearch}>Go</button>
                        </div>

                        <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
                            Filters
                        </button>

                        {isFilterVisible && (
                            <div className="filter-options">
                                {/* Placeholder for filter options */}
                                <p>Filter options will go here.</p>
                                {/* Implement actual filter options as needed */}
                            </div>
                        )}
                    </>
                )}

            </div>
            

            {/* ... rest of your components ... */}

        </div>
    );
}

export default MapUI;