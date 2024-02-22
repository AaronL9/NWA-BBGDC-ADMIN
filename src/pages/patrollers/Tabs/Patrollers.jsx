import { useEffect, useState, useContext } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationList,
  Conversation,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

// firebase
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// components
import AddButton from "../../../components/global/add-button/AddButton";
import PatrollerForm from "../../../components/patrollers/PatrollerForm";
import Spinner from "../../../components/global/spinner/Spinner";

export default function Patrollers() {
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  openForm
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
  const path = "/images/profile-circle.png";

  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "rooms"), where("admin.id", "==", admin.uid)),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            docId: doc.id,
            patroller: doc.data().patroller,
          };
        });
        setRooms(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      }
    );

    return () => unsubscribe();
  }, [admin.uid]);

  const navigatTo = (patroller, docId) => {
    localStorage.setItem("patrollerId", patroller.id);
    localStorage.setItem("patrollerName", patroller.displayName);
    navigate(`chat/${docId}`);
  };

  return (
    <>
      {openForm && <PatrollerForm setOpenForm={setOpenForm} />}
      <AddButton setOpenForm={setOpenForm} />
      {loading ? (
        <div className="loader-overlay">
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            height: "340px",
            marginBlock: "14px",
          }}
        >
          <ConversationList loading={loading}>
            {rooms.map((data) => (
              <Conversation
                key={data.docId}
                name={data.patroller.displayName}
                info="Yes i can do it for you"
                onClick={() => navigatTo(data.patroller, data.docId)}
              >
                <Avatar src={path} name="Lilly" />
              </Conversation>
            ))}
          </ConversationList>
        </div>
      )}
    </>
  );
}
