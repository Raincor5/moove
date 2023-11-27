// import React, { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './MapComponent.scss';
// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';

// function MapComponent() {
//     const mapRef = useRef(null); // Create a ref for the map container
//     const mapInstanceRef = useRef(null); // Ref to store the map instance
  
//     useEffect(() => {
//       if (!mapRef.current || mapInstanceRef.current) return; // Only initialize the map once
  
//       // Initialize the map
//       mapInstanceRef.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
  
//     //   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     //     maxZoom: 19,
//     //     minZoom: 4,
//     //     tileSize: 512,
//     //     zoomOffset: -1,
//     //     attribution: '© OpenStreetMap contributors',
//     //     id: 'raincor/cktyvcl2e1bns17sc9f3cfgyq',
//     //     accessToken: 'pk.eyJ1IjoicmFpbmNvciIsImEiOiJja3R1bTVzZ2kyMWg4MnZwbm9hZXZzdmVrIn0.3JM64Knf4fHYlL2gAB-_pQ'
//     //   }).addTo(mapInstanceRef.current);

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       attribution: '© OpenStreetMap contributors'
//       }).addTo(mapInstanceRef.current);

//       return () => {
//           if (mapInstanceRef.current) {
//           mapInstanceRef.current.remove(); // Clean up the map instance on unmount
//           }
//       };
//       }, []);
  
//     return <div ref={mapRef} className='map-container' ></div>;
//   }
  
//   export default MapComponent;
// function MapComponent() {
//   return (
//     <MapContainer 
//       center={[51.505, -0.09]} 
//       zoom={13} 
//       scrollWheelZoom={false}
//       style={{ height: '500px', width: '100%' }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={[51.505, -0.09]}>
//         <Popup>
//           A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

// export default MapComponent;

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import MapUI from './MapUI';
import toRentIcon from './img/to-rent_icon.png'; // Adjust the path as needed
import forSaleIcon from './img/for-sale-icon.png'; // Adjust the path as needed

// Correct the path for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function MapComponent() {
  // Mapbox tile layer URL and access token
  const mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  const accessToken = 'pk.eyJ1IjoicmFpbmNvciIsImEiOiJja3R1bTVzZ2kyMWg4MnZwbm9hZXZzdmVrIn0.3JM64Knf4fHYlL2gAB-_pQ'; // Replace with your Mapbox access token
  const mapboxId = 'raincor/cktyvcl2e1bns17sc9f3cfgyq'; // Replace with your Mapbox style ID

  const [dealType, setDealType] = useState('for-sale');
  const [properties, setProperties] = useState([]);

  const fetchProperties = async (dealType) => {
    // API  request to deal with dealType switch
    // To fetch properties based on dealType
    // Update properties state
    try {
      const typeToFetch = dealType;
      const url = `http://localhost:5000/api/listings?deal_type=${typeToFetch}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);  // Log fetched data
      console.log(url)
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }

  };

  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/listings?deal_type=${dealType}`);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //     const contentType = response.headers.get('content-type');
  //     if (!contentType || !contentType.includes('application/json')) {
  //       throw new Error(`Expected JSON response, got: ${contentType}`);
  //     }
  //       const data = await response.json();
  
  //       // Filter properties based on dealType
  //       const filteredProperties = data.filter(property => property.dealType === dealType);
  
  //       // Set the properties state
  //       setProperties(filteredProperties);
  //     } catch (error) {
  //       console.error('Error fetching properties:', error);
  //     }
  //   };
  
  //   fetchProperties();
  // }, [dealType]);

  // Function to create custom marker icon
  const createCustomIcon = (property) => {
    return L.icon({
      // Define icon properties
      iconUrl: property.deal_type === 'to-rent' ? toRentIcon : forSaleIcon,
      iconSize: [25, 41], // Adjust size as needed
      iconAnchor: [12, 41], // Adjust anchor as needed
      popupAnchor: [1, -34], // Adjust popup anchor as needed
      shadowSize: [41, 41] // Adjust shadow size as needed
    });
  };

  // useEffect(() => {
  //   fetchProperties()
  //     .then(data => {
  //       setProperties
  //     })
  //     const filteredProperties = properties.filter(property => property.dealType === dealType);
  //     setProperties(filteredProperties);
  // }, [dealType]);

  // useEffect(() => {
  //   fetchProperties(dealType)
  //     .then(fetchedProperties => {
  //       // Log the fetched properties for debugging
  //       console.log('Fetched Properties:', fetchedProperties);
  
  //       // Filter the properties based on the dealType
  //       const filteredProperties = fetchedProperties.filter(property => property.deal_type === dealType);
  
  //       // Log the filtered properties for debugging
  //       console.log('Filtered Properties:', filteredProperties);
  
  //       // Update the state with the filtered properties
  //       setProperties(filteredProperties);
  //     })
  //     .catch(error => {
  //       // Log any errors that occur during fetching
  //       console.error('Error fetching properties:', error);
  //     });
  // }, [dealType]);

  // useEffect(() => {
  //   fetchProperties(dealType)
  //   .then(fetchedProperties => {
  //     console.log('Raw Fetched Properties:', fetchedProperties);

  //     const filteredProperties = fetchedProperties.filter(property => {
  //       return property.deal_type === dealType && property.lat != null && property.lng != null;
  //     });

  //     console.log('Filtered Properties:', filteredProperties);

  //     setProperties(filteredProperties);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching properties:', error);
  //   });
  // }, [dealType]);

  useEffect(() => {
    fetchProperties(dealType)
  }, [dealType]);

  return (
    <div className='map-ui-container'>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        scrollWheelZoom={true}
        zoomControl={false}
        className='map-container'
      //   style={{ height: '500px', width: '100%' }}
      >
        <MapUI /* ...props */ fetchProperties={fetchProperties} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapboxUrl}
          id={mapboxId}
          accessToken={accessToken}
          tileSize={512}
          zoomOffset={-1}
        />
        {properties.map((property, index) => (
          <Marker 
            key={`property-${index}`} // Use the index as part of the key
            position={[property.lat, property.lng]}
            icon={createCustomIcon(property)} // Use a custom icon
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
    </div>
  );
}

export default MapComponent;
