import PropType from "prop-types";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { collection, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

const CustomMarker = ({ data, pinStyle }) => {
  const [showInforWindow, setShowInfoWindow] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      position={data.coords}
      onClick={() => setShowInfoWindow((prev) => !prev)}
      ref={markerRef}
    >
      <Pin {...pinStyle}></Pin>
      {showInforWindow && (
        <InfoWindow
          onCloseClick={() => setShowInfoWindow(false)}
          anchor={marker}
          pixelOffset={50}
        >
          <h3 style={{ textTransform: "capitalize" }}>{data.label}</h3>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default function MapView({ coords }) {
  const [patrollersLocation, setPatrollersLocation] = useState([]);

  const [refresh, setRefresh] = useState(false);

  async function fetchAllPatrollerLocation() {
    const querySnapshot = await getDocs(collection(db, "patrollers"));
    const locations = querySnapshot.docs
      .filter((doc) => {
        const location = doc.data()?.patrollerLocation;
        if (!location) return false;
        return true;
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          coords: data.patrollerLocation,
          patrollerName: `${data.firstName} ${data.lastName}`,
        };
      });

    console.log(locations);
    setPatrollersLocation(locations);
  }

  useEffect(() => {
    fetchAllPatrollerLocation();
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
        {patrollersLocation.map((data) => (
          <CustomMarker
            key={data.id}
            data={{
              coords: data.coords,
              label: data.patrollerName,
            }}
            pinStyle={{
              background: "#021fb3",
              glyphColor: "#fff",
              borderColor: "#fff",
            }}
          />
        ))}
        <AdvancedMarker position={coords}>
          <Pin />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
}

MapView.propTypes = {
  coords: PropType.object,
};
