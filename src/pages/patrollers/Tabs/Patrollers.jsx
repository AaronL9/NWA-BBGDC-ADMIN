import { useContext, useEffect, useState } from "react";

// firebase
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";

// components
import PatrollerProfileCard from "../../../components/patrollers/PatrollerProfileCard";
import { AuthContext } from "../../../context/AuthContext";
import AddButton from "../../../components/global/add-button/AddButton";
import PatrollerForm from "../../../components/patrollers/PatrollerForm";

export default function Patrollers() {
  const authCtx = useContext(AuthContext);
  const [patrollers, setPatrollers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  openForm
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "patrollers"),
      (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj.id = doc.id;
          data.push(obj);
        });
        console.log(data);
        setPatrollers(data);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      {openForm && <PatrollerForm setOpenForm={setOpenForm} />}
      <AddButton setOpenForm={setOpenForm} />
      <div className="patrollers-card-wrapper">
        {patrollers.map((patroller) => (
          <PatrollerProfileCard
            key={patroller.id}
            email={patroller.email}
            firstName={patroller.firstName}
            lastName={patroller.lastName}
            contactNum={patroller.phoneNo}
            address={patroller.address}
            roomId={`${patroller.uid}_${authCtx.admin.uid}`}
            uid={patroller.uid}
          />
        ))}
      </div>
    </>
  );
}
