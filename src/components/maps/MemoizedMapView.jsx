import React from "react";
import PropType from "prop-types";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { animateMarkerTo } from "./mapUtils";

const containerStyle = {
  width: "100%",
  height: "100%",
};

function MapView({ coords }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBLZTo8cFwUX8Ux5TkvSt5oLtd0hURQ6bc",
  });

  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(coords);
      map.fitBounds(bounds);
      mapRef.current = map;
    },
    [coords]
  );

  const onClick = React.useCallback((event) => {
    animateMarkerTo(markerRef.current.marker, event.latLng);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    mapRef.current = null;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coords}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onClick}
      mapTypeId="hybrid"
    >
      <Marker ref={markerRef} position={coords} />
    </GoogleMap>
  ) : (
    <></>
  );
}

MapView.propTypes = {
  coords: PropType.object,
};

const MemoizedMapView = React.memo(MapView);

export default MemoizedMapView;
