import { useEffect, useState, useContext } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationList,
  Conversation,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

// firebase
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// components
import AddButton from "../../../components/global/add-button/AddButton";
import PatrollerForm from "../../../components/patrollers/PatrollerForm";
import Spinner from "../../../components/global/spinner/Spinner";
import { ChatContext } from "../../../context/ChatContext.jsx";

export default function Patrollers() {
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  openForm
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
  const path = "/images/profile-circle.png";

  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const { setAvatar } = useContext(ChatContext);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "rooms"),
        where("admin.id", "==", admin.uid),
        orderBy("updatedAt", "desc")
      ),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setRooms(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      }
    );

    return () => unsubscribe();
  }, [admin.uid, setAvatar]);

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
                onClick={() => {
                  setAvatar(data.patrollerAvatarURL);
                  navigatTo(data.patroller, data.docId);
                }}
                info={data?.lastMessage?.message ?? "You are now connected"}
                lastSenderName={data?.lastMessage?.id === admin.uid && "You"}
                unreadDot={!data?.adminSeen ?? false}
              >
                <Avatar
                  src={data.patrollerAvatarURL || path}
                  name={data.patroller.displayName}
                />
              </Conversation>
            ))}
          </ConversationList>
        </div>
      )}
    </>
  );
}
