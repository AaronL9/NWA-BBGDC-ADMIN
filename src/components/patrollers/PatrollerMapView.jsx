import PropType from "prop-types";
import {
  APIProvider,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link, useParams } from "react-router-dom";
import polyline from "@mapbox/polyline";
import {
  Polyline,
  GoogleMap,
  GoogleMapApiLoader,
  Marker,
  AdvancedMarker,
  PinElement,
  InfoWindow,
} from "react-google-map-wrapper";

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
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const { id } = useParams();

  const renderRoute = async () => {
    console.log(
      `${reportedLocation[0].coords.lat}, ${reportedLocation[0].coords.lng}`
    );
    try {
      const apiKey = "AIzaSyBLZTo8cFwUX8Ux5TkvSt5oLtd0hURQ6bc";
      const origin = `${coords.lat},${coords.lng}`;
      const destination = `${reportedLocation[0].coords.lat},${reportedLocation[0].coords.lng}`;

      const response = await fetch(
        `/maps/api/directions/json?destination=${destination}&origin=${origin}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        const points = data.routes[0].overview_polyline.points;
        const decodedCoordinates = polyline.decode(points);
        const routeCoordinates = decodedCoordinates.map((coord) => ({
          lat: coord[0],
          lng: coord[1],
        }));
        setRouteCoordinates(routeCoordinates);
      } else {
        alert("Error fetching directions:", data.status);
      }
    } catch (error) {
      alert("Error fetching directions:", error.message);
    }
  };

  useEffect(() => {
    const getReportedLocation = async () => {
      const collectionRef = collection(db, "live_location");

      const q = query(
        collectionRef,
        where("assignPatrollers", "array-contains-any", [id])
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReportedLocation(data);
      console.log(data);
    };
    getReportedLocation();
  }, []);

  useEffect(() => {
    if (reportedLocation.length) {
      renderRoute();
    }
  }, [reportedLocation]);

  // <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
  //   <Map
  //     zoom={19}
  //     center={coords}
  //     gestureHandling={"cooperative"}
  //     mapTypeId="hybrid"
  //     mapId={import.meta.env.VITE_MAP_ID}
  //   >
  //     <AdvancedMarker position={coords}>
  //       <Pin background={"#021fb3"} glyphColor={"#fff"} borderColor={"#fff"} />
  //     </AdvancedMarker>
  //     {/* {routeCoordinates.length > 0 && (
  //         <Polyline
  //           path={routeCoordinates}
  //           strokeColor="#FF0000"
  //           strokeOpacity={1.0}
  //           strokeWeight={2}
  //           geodesic
  //         />
  //       )} */}
  //     {reportedLocation.map((location) => (
  //       <CustomMarker
  //         key={location.id}
  //         data={{
  //           coords: location.coords,
  //           id: location.id,
  //           label: location.offense,
  //         }}
  //       />
  //     ))}
  //   </Map>
  // </APIProvider>;

  return (
    <>
      <GoogleMapApiLoader apiKey="AIzaSyBLZTo8cFwUX8Ux5TkvSt5oLtd0hURQ6bc">
        <GoogleMap
          style={{ height: "500px" }}
          zoom={17}
          center={coords}
          mapOptions={{
            mapTypeId: "hybrid",
            mapId: import.meta.env.VITE_MAP_ID,
          }}
        >
          <AdvancedMarker lat={coords.lat} lng={coords.lng}>
            <PinElement
              background={"#021fb3"}
              glyphColor={"#fff"}
              borderColor={"#fff"}
            />
          </AdvancedMarker>
          {routeCoordinates.length > 0 && (
            <Polyline
              path={routeCoordinates}
              strokeColor="blue"
              strokeOpacity={1.0}
              strokeWeight={5}
              geodesic
            />
          )}
          {reportedLocation.length > 0 && (
            <InfoWindow
              content={
                <>
                  <h3>{reportedLocation[0].offense}</h3>
                  <Link to={`/reports/${reportedLocation[0].id}`}>View</Link>
                </>
              }
              onCloseClick={() => setOpen(false)}
              open={isOpen}
            >
              <AdvancedMarker
                lat={reportedLocation[0].coords.lat}
                lng={reportedLocation[0].coords.lng}
                onClick={() => setOpen(true)}
              >
                <PinElement
                  background={"red"}
                  glyphColor={"#fff"}
                  borderColor={"#fff"}
                />
              </AdvancedMarker>
            </InfoWindow>
          )}
        </GoogleMap>
      </GoogleMapApiLoader>
    </>
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
