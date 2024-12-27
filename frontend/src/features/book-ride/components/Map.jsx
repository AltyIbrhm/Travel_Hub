import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current, {
        center: [51.505, -0.09], // Default center coordinates
        zoom: 13,
        zoomControl: true
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Handle click events
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Clear previous markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new marker
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<i class="bi bi-geo-alt text-primary fs-4"></i>',
            iconSize: [25, 25],
            iconAnchor: [12, 24]
          })
        }).addTo(map);

        markersRef.current.push(marker);

        // Get location name using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const locationName = data.display_name;
            marker.bindPopup(locationName).openPopup();
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, name: locationName });
            }
          });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%', borderRadius: '8px' }} />;
};

export default Map; 