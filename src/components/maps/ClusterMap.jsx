import React, { useEffect, useState, useRef } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import trees from "./trees";

export default function Intro() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
        <Map
          center={{ lat: 43.64, lng: -79.41 }}
          zoom={10}
          mapId={import.meta.env.VITE_MAP_ID}
        >
          <Markers points={trees} />
        </Map>
      </APIProvider>
    </div>
  );
}

const Markers = ({ points }) => {
  const map = useMap();
  const clusterer = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer(map, [], {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      });
    }

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    points.forEach((point) => {
      const marker = new window.google.maps.Marker({
        position: point,
      });

      markersRef.current.push(marker);
    });

    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(markersRef.current);

    return () => {
      clusterer.current.clearMarkers();
    };
  }, [map, points]);

  return null; // No need to render anything, as AdvancedMarker is not used
};
