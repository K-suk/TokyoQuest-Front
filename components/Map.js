// components/Map.js
import React, { useEffect } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const Map = ({ quests, onMarkerClick }) => {
  useEffect(() => {
    const loadMap = () => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.682839, lng: 139.759455 },
        zoom: 12,
      });

      const markers = quests.map((quest) => {
        if (quest.latitude && quest.longitude) {
          const marker = new google.maps.Marker({
            position: { lat: quest.latitude, lng: quest.longitude },
            title: quest.title,
          });

          marker.addListener('click', () => {
            onMarkerClick(quest);
          });

          return marker;
        }
        return null;
      }).filter(marker => marker !== null);

      new MarkerClusterer({
        map,
        markers,
        options: {
          styles: [
            {
              textColor: 'black',
              textSize: 14,
              url: '',
              height: 40,
              width: 40,
              backgroundColor: 'white',
              borderRadius: '50%',
              borderWidth: '1px',
              borderColor: 'black'
            }
          ]
        }
      });
    };

    if (!window.google) {
      window.loadMap = loadMap;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, [quests, onMarkerClick]);

  return <div id="map" style={{ height: 'calc(100vh - 56px)', width: '100%' }} />;
};

export default Map;