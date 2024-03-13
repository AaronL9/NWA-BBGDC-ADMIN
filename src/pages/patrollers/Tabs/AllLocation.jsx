import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { db } from "../../../config/firebase";
import PropType from "prop-types";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

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

export default function AllLocation() {
  const [patrollersLocation, setPatrollersLocation] = useState([]);
  const [reportedLocation, setReportedLocation] = useState([]);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPatrollersLocation = async () => {
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
            coords: data.patrollerLocation,
            patrollerName: `${data.firstName} ${data.lastName}`,
          };
        });

      setPatrollersLocation(locations);
    };
    const fetchReportedLocation = async () => {
      const querySnapshot = await getDocs(collection(db, "live_location"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setReportedLocation(data);
    };

    fetchPatrollersLocation();
    fetchReportedLocation();
  }, [refresh]);

  return (
    <div className="report__map all-patroller-location">
      <IconButton
        aria-label="refresh"
        color="primary"
        sx={{ marginLeft: "auto" }}
        onClick={() => setRefresh((prev) => !prev)}
      >
        <RefreshIcon />
      </IconButton>
      <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
        <Map
          zoom={14}
          center={{ lat: 16.071917235901985, lng: 120.3400965898522 }}
          gestureHandling={"greedy"}
          mapTypeId="satellite"
          mapId={import.meta.env.VITE_MAP_ID}
        >
          {patrollersLocation.map((data, index) => (
            <CustomMarker
              key={index}
              data={{ coords: data.coords, label: data.patrollerName }}
              pinStyle={{
                background: "#021fb3",
                glyphColor: "#fff",
                borderColor: "#fff",
              }}
            />
          ))}
          {reportedLocation.map((location, index) => (
            <CustomMarker
              key={index}
              data={{ coords: location.coords, label: location.offense }}
              pinStyle={{
                background: "red",
                glyphColor: "#fff",
                borderColor: "#fff",
              }}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

CustomMarker.propTypes = {
  data: PropType.object,
  pinStyle: PropType.object,
};
