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

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.scss';
import MapUI from './MapUI';

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
        <MapUI /* ...props */ />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapboxUrl}
          id={mapboxId}
          accessToken={accessToken}
          tileSize={512}
          zoomOffset={-1}
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
