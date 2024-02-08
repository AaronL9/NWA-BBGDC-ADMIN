import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const ChatContext = createContext({ avatar: "", setAvatar: () => {} });

export function ChatProvider({ children }) {
  const [avatar, setAvatar] = useState("");

  const value = { avatar, setAvatar };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

ChatProvider.propTypes = {
  children: PropTypes.element,
};
