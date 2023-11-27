import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import MapUI from './MapUI';
import FilterUI from './FilterUI'; // Import the FilterUI component
import toRentIcon from './img/to-rent_icon.png'; // Adjust the path as needed
import forSaleIcon from './img/for-sale-icon.png'; // Adjust the path as needed

// Correct the path for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Custom component to handle map events
function MapEvents({ onZoomChange, mapRef }) {
  useMapEvents({
    zoomend: () => {
      if (mapRef && mapRef.current) {
        onZoomChange(mapRef.current.getZoom());
      }
    }
  });
  return null;
}

function MapComponent() {
  // Mapbox tile layer URL and access token
  const mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  const accessToken = 'pk.eyJ1IjoicmFpbmNvciIsImEiOiJja3R1bTVzZ2kyMWg4MnZwbm9hZXZzdmVrIn0.3JM64Knf4fHYlL2gAB-_pQ'; // Replace with your Mapbox access token
  const mapboxId = 'raincor/cktyvcl2e1bns17sc9f3cfgyq'; // Replace with your Mapbox style ID
  const mapRef = useRef(null);

  const [dealType, setDealType] = useState('to-rent');
  const [properties, setProperties] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(13); // Default zoom level
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    livingRooms: '',
  });

  const MIN_ZOOM_LEVEL_FOR_MARKERS = 13;

  // const fetchProperties = async () => {
  //   try {
  //     const url = `http://localhost:5000/api/listings?deal_type=${dealType}`;
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     console.log("Fetched data:", data);
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching properties:', error);
  //     return [];
  //   }
  // };
  const fetchProperties = async (filters) => {
    try {
      // Construct query parameters
      let query = new URLSearchParams({ deal_type: dealType });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
  
      // Update URL with query parameters
      const url = `http://localhost:5000/api/listings?${query.toString()}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched data with filters:", data);
      return data;
    } catch (error) {
      console.error('Error fetching properties with filters:', error);
      return [];
    }
  };
  

  useEffect(() => {
    fetchProperties(filters).then(fetchedProperties => {
      const validProperties = fetchedProperties.filter(property => 
        property.deal_type === dealType && property.lat && property.lng
      );
      setProperties(validProperties);
    });
  }, [dealType]);

  const onFilterChange = (newFilters) => {
      // Update the filters state
      setFilters(newFilters);

      // Optionally, immediately fetch properties based on new filters
      fetchProperties(newFilters);
  }


  const handleZoomChange = () => {
    const map = mapRef.current;
    if (map) {
        const newZoom = map.getZoom();
        setCurrentZoom(newZoom);
    }
  };


  // Function to handle deal type changes from MapUI
  const handleDealTypeChange = (newDealType) => {
    setDealType(newDealType); // Update dealType state
  };


  const createCustomIcon = (property) => {
    return L.icon({
      iconUrl: property.deal_type === 'to-rent' ? toRentIcon : forSaleIcon,
      iconSize: [100, 85],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };


  return (
    <div className='map-ui-container'>
      <MapContainer 
        center={[57.14369, -2.09814]} 
        zoom={13} 
        scrollWheelZoom={true}
        zoomControl={false}
        className='map-container'
        ref={mapRef}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapboxUrl}
          id={mapboxId}
          accessToken={accessToken}
          tileSize={512}
          zoomOffset={-1}
        />
        {/* MapEvents listens for zoom events ande xecutes handleZoomCHange */}
        <MapEvents onZoomChange={handleZoomChange} mapRef={mapRef} />
        {/* <MapUI onDealTypeChange={handleDealTypeChange} /> */}
        <MapUI fetchProperties={() => fetchProperties().then(setProperties)} />
        {/* Other map components like TileLayer */}
        {currentZoom >= MIN_ZOOM_LEVEL_FOR_MARKERS && properties.map((property) => (
            // ... Marker and Popup components ...
            <Marker 
              key={property.id || property.address} // Use a unique identifier
              position={[property.lat, property.lng]}
              icon={createCustomIcon(property)}
            >
              <Popup>
                <div>
                  <h3>{property.title}</h3>
                  <p>Price: {property.price}</p>
                  <p>Bedrooms: {property.bedrooms}</p>
                  <p>Bathrooms: {property.bathrooms}</p>
                  <p>Living rooms: {property.living_rooms}</p>
                  <address>Address: {property.address}</address>
                  <p>Description: {property.description}</p>
                </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
      <FilterUI onFilterChange={onFilterChange} />
    </div>
  );
}

export default MapComponent;
