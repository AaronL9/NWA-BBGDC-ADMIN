import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import PatrollerProfileCard from "../../components/patrollers/PatrollerProfileCard";
import Spinner from "../../components/global/spinner/Spinner";
// import MemoizedMapView from "../../components/maps/MemoizedMapView";
import MapView from "../../components/reports/MapView.jsx";

export default function PatrollerLocation() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [patrollerData, setPatrollerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const docRef = doc(db, "patrollers", id);

        const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const location = docSnapshot.data().patrollerLocation;
            const data = docSnapshot.data();
            setPatrollerData(data);
            setLocation(location);
            setLoading(false);
          } else {
            console.log("Document does not exist.");
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [id]);

  return (
    <div className="patroller-route">
      {loading && !patrollerData ? (
        <div className="loader-overlay">
          <Spinner />
        </div>
      ) : (
        <div className="patroller-route__container">
          <PatrollerProfileCard data={patrollerData} />
          {location && (
            <div className="patroller-route__map">
              <MapView coords={location} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
