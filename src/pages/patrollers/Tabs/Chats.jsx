import { useContext, useEffect, useState } from "react";
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

export default function Chats() {
  const path = "/images/profile-circle.png";

  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "rooms"), where("admin.id", "==", admin.uid)),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          patroller: doc.data().patroller,
        }));
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
    navigate(`${docId}`);
  };

  return (
    <div
      style={{
        height: "340px",
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
  );
}

Chats.propTypes = {};
