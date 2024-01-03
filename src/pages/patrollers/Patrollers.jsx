import { useContext, useEffect, useState } from "react";
import "./patrollers.css";

// firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

// components
import PatrollerProfileCard from "../../components/patrollers/PatrollerProfileCard";
import { AuthContext } from "../../context/AuthContext";

export default function Patrollers() {
  const authCtx = useContext(AuthContext);
  const [patrollers, setPatrollers] = useState([]);

  useEffect(() => {
    const fetchPatrollers = async () => {
      const querySnapshot = await getDocs(collection(db, "patrollers"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const obj = doc.data();
        obj.id = doc.id;
        data.push(obj);
      });
      console.log(data);
      setPatrollers(data);
    };
    fetchPatrollers();
  }, []);

  return (
    <div className="patrollers">
      {patrollers.map((patroller) => (
        <PatrollerProfileCard
          key={patroller.id}
          email={patroller.email}
          firstName={patroller.firstName}
          lastName={patroller.lastName}
          contactNum={patroller.contactNum}
          roomId={patroller.uid + authCtx.admin.uid}
        />
      ))}
    </div>
  );
}
