import { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp } from "firebase/firestore";

// CHAT UI
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  InfoButton,
} from "@chatscope/chat-ui-kit-react";

// firebase
import {
  collection,
  setDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { formatTimeChat } from "../../util/dateFormatter.js";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Patrollers() {
  const { avatar } = useContext(ChatContext);
  const { roomId } = useParams();

  const patrollerName = localStorage.getItem("patrollerName");
  const patrollerId = localStorage.getItem("patrollerId");

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { admin } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState({
    createdAt: "",
    text: "",
    user: { _id: admin.uid },
  });

  function removeEmptyLines(inputString) {
    const lines = inputString.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim() !== "");
    const resultString = nonEmptyLines.join("\n");
    return resultString;
  }

  const inputChatHanlder = (_, __, text) => {
    setInputMessage((value) => ({
      ...value,
      text: text,
    }));
  };

  useEffect(() => {
    const collectionRef = collection(db, "rooms", roomId, "chats");
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.docs[0]?.data()?.createdAt) return;
      setMessages(
        querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            _id: doc.id,
            position: data.user._id === admin.uid ? "outgoing" : null,
            type: "text",
          };
        })
      );
    });
    return unsubscribe;
  }, [admin.email, roomId, admin.uid]);

  const onSend = useCallback(async () => {
    inputMessage.text = removeEmptyLines(inputMessage.text);

    const docID = uuidv4();
    const chatDocRef = doc(db, "rooms", roomId, "chats", docID);

    try {
      await setDoc(chatDocRef, {
        ...inputMessage,
        createdAt: serverTimestamp(),
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/push/chat-notification`,
        {
          method: "POST",
          body: JSON.stringify({ patrollerId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.admin.accessToken,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log(json);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, [inputMessage, roomId, authCtx.admin.accessToken, patrollerId]);

  return (
    <div className="patroller__chat">
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back
                onClick={() => navigate("/patrollers")}
              />
              <Avatar
                src={avatar ? avatar : "/images/profile-circle.png"}
                style={{ objectFit: "cover" }}
              />
              <ConversationHeader.Content>
                <span>{patrollerName}</span>
              </ConversationHeader.Content>
              <ConversationHeader.Actions>
                <InfoButton
                  title="Show info"
                  onClick={() =>
                    navigate(`/patrollers/location/${patrollerId}`)
                  }
                />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList>
              {messages.map((message) => (
                <Message
                  key={message._id}
                  className="patroller__chat-container"
                  type="text"
                  model={{
                    message: message.text,
                    direction: message.position,
                    position: "last",
                    sentTime: "just now",
                  }}
                >
                  {!message.position && (
                    <Message.Footer
                      className="patroller__chat-footer"
                      sentTime={formatTimeChat(message.createdAt)}
                    />
                  )}
                  {!message.position && (
                    <Avatar
                      src={avatar ? avatar : "/images/profile-circle.png"}
                    />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              attachButton={false}
              onChange={inputChatHanlder}
              onSend={onSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}
