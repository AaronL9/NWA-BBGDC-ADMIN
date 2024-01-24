import { useParams } from "react-router-dom";
import MapView from "../../components/reports/MapView";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function PatrollerLocation() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const collectionRef = collection(db, "patrollers");

        const q = query(collectionRef, where("uid", "==", id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            setLocation(docSnap.data().patrollerLocation);
          } else {
            console.log("No documents found matching the query.");
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    fetchLocation();
  }, [id]);

  console.log(location);

  return (
    <div className="patroller-route">
      {location && <MapView coords={location} />}
    </div>
  );
}
