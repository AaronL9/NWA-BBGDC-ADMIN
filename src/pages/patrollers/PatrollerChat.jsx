import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

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

export default function Patrollers() {
  const { admin } = useAuthContext();
  const { id: roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState({
    _id: "",
    createdAt: "",
    text: "",
    user: { _id: admin.email },
  });

  const inputChatHanlder = (e) => {
    setInputMessage((value) => ({
      ...value,
      text: e.target.value,
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
            position: data.user._id === admin.email ? "right" : "left",
            type: "text",
          };
        })
      );
    });
    return unsubscribe;
  }, [admin.email, roomId]);

  const onSend = useCallback(() => {
    setMessages((previousMessages) => [...previousMessages, inputMessage]);
    const chatDocRef = doc(collection(db, "rooms", roomId, "chats"));
    setDoc(chatDocRef, {
      ...inputMessage,
      createdAt: new Date(),
      _id: uuidv4(),
    });
  }, [inputMessage, roomId]);

  console.log(messages);

  return (
    <div className="patroller__chat">
      <MessageList
        className="message-list"
        lockable={false}
        toBottomHeight={"100%"}
        dataSource={messages}
      />
      <Input
        className="chat__input"
        placeholder="Type here..."
        multiline={true}
        rightButtons={<button onClick={onSend}>send</button>}
        onChange={inputChatHanlder}
      />
    </div>
  );
}
