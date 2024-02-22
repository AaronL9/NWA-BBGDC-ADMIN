import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { db } from "../../../config/firebase";

export default function AllLocation() {
  const [patrollersLocation, setPatrollersLocation] = useState([]);

  useEffect(() => {
    const fetchPatrollersLocation = async () => {
      const querySnapshot = await getDocs(collection(db, "patrollers"));
      const locations = querySnapshot.docs
        .filter((doc) => {
          const location = doc.data()?.patrollerLocation;
          if (!location) return false;
          return true;
        })
        .map((doc) => doc.data().patrollerLocation);

      setPatrollersLocation(locations);
    };
    fetchPatrollersLocation();
  }, []);

  return (
    <div className="report__map">
      <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
        <Map
          zoom={14}
          center={{ lat: 16.071917235901985, lng: 120.3400965898522 }}
          gestureHandling={"cooperative"}
        >
          {patrollersLocation.map((coords, index) => (
            <Marker key={index} position={coords} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
