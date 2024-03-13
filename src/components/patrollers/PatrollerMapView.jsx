import PropType from "prop-types";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
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
      <Pin background={"red"} glyphColor={"#fff"} borderColor={"#fff"}></Pin>
      {showInforWindow && (
        <InfoWindow
          onCloseClick={() => setShowInfoWindow(false)}
          anchor={marker}
          pixelOffset={50}
        >
          <h3 style={{ textTransform: "capitalize" }}>{data.label}</h3>

          <Link to={`/reports/${data.id}`}>View</Link>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default function PatrollerMapView({ coords }) {
  const [reportedLocation, setReportedLocation] = useState([]);

  useEffect(() => {
    const getReportedLocation = async () => {
      const snapshot = await getDocs(collection(db, "live_location"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReportedLocation(data);
    };
    getReportedLocation();
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
      <Map
        zoom={19}
        center={coords}
        gestureHandling={"cooperative"}
        mapTypeId="hybrid"
        mapId={import.meta.env.VITE_MAP_ID}
      >
        <AdvancedMarker position={coords}>
          <Pin
            background={"#021fb3"}
            glyphColor={"#fff"}
            borderColor={"#fff"}
          />
        </AdvancedMarker>
        {reportedLocation.map((location) => (
          <CustomMarker
            key={location.id}
            data={{
              coords: location.coords,
              id: location.id,
              label: location.offense,
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

PatrollerMapView.propTypes = {
  coords: PropType.object,
};

CustomMarker.propTypes = {
  data: PropType.object,
  pinStyle: PropType.object,
  isPatroller: PropType.bool,
};
