import { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";
import { v4 as uuidv4 } from "uuid";

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

export default function Patrollers() {
  const { avatar } = useContext(ChatContext);
  const { id: roomId, name } = useParams();
  const navigate = useNavigate();
  const patrollerName = name.split("_").join(" ");

  const { admin } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState({
    _id: "",
    createdAt: "",
    text: "",
    user: { _id: admin.email },
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
      setMessages(
        querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            position: data.user._id === admin.email ? "outgoing" : null,
            type: "text",
          };
        })
      );
    });
    return unsubscribe;
  }, [admin.email, roomId]);

  const onSend = useCallback(() => {
    inputMessage.text = removeEmptyLines(inputMessage.text);

    const chatDocRef = doc(collection(db, "rooms", roomId, "chats"));
    setDoc(chatDocRef, {
      ...inputMessage,
      createdAt: new Date(),
      _id: uuidv4(),
    });
  }, [inputMessage, roomId]);

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
                name={patrollerName}
                style={{ objectFit: "cover" }}
              />
              <ConversationHeader.Content
                userName={patrollerName}
                info="Active 10 mins ago"
              />
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
