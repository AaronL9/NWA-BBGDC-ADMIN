import PropType from "prop-types";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { Link } from "react-router-dom";

const CustomMarker = ({ data }) => {
  const [showInforWindow, setShowInfoWindow] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      position={data.coords}
      onClick={() => setShowInfoWindow((prev) => !prev)}
      ref={markerRef}
    >
      <Pin background="none" borderColor="none" glyphColor="none">
        <div
          className={`dashboard-map_pin-point pin-point-${data.status}`}
        ></div>
      </Pin>
      {showInforWindow && (
        <InfoWindow
          onCloseClick={() => setShowInfoWindow(false)}
          anchor={marker}
          pixelOffset={50}
        >
          <h3 style={{ textTransform: "capitalize" }}>{data.offense}</h3>
          <p>{data.date}</p>
          <Link to={`/reports/${data.id}`}>View</Link>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default function DashboardMap({ markers }) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
      <Map
        zoom={15}
        center={{ lat: 16.071944602703823, lng: 120.33983299327511 }}
        gestureHandling={"greedy"}
        mapTypeId="hybrid"
        style={{ borderRadius: "8px", height: "500px" }}
        mapId={import.meta.env.VITE_MAP_ID}
      >
        {markers.map((data, index) => (
          <CustomMarker key={index} data={data} />
        ))}
      </Map>
    </APIProvider>
  );
}

DashboardMap.propTypes = {
  markers: PropType.array,
};

CustomMarker.propTypes = {
  data: PropType.object,
};
