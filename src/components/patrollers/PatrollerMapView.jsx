import PropType from "prop-types";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function PatrollerMapView({ coords }) {
  const [reportedLocation, setReportedLocation] = useState([]);

  useEffect(() => {
    const getReportedLocation = async () => {
      const snapshot = await getDocs(collection(db, "live_location"));
      const data = snapshot.docs.map((doc) => doc.data());
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
        {reportedLocation.map((location, index) => (
          <AdvancedMarker key={index} position={location.coords}>
            <Pin background={"red"} glyphColor={"#fff"} borderColor={"#fff"} />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}

PatrollerMapView.propTypes = {
  coords: PropType.object,
};
