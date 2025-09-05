import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type JsonObject = Record<string, unknown>;

type ChatContextType = {
  selectedChat: JsonObject | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<JsonObject | null>>;
  user: JsonObject | null;
  setUser: React.Dispatch<React.SetStateAction<JsonObject | null>>;
  notification: JsonObject[];
  setNotification: React.Dispatch<React.SetStateAction<JsonObject[]>>;
  chats: JsonObject[] | null;
  setChats: React.Dispatch<React.SetStateAction<JsonObject[] | null>>;
  friends: JsonObject[];
  setFriends: React.Dispatch<React.SetStateAction<JsonObject[]>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<JsonObject | null>(null);
  const [user, setUser] = useState<JsonObject | null>(null);
  const [notification, setNotification] = useState<JsonObject[]>([]);
  const [chats, setChats] = useState<JsonObject[] | null>(null);
  const [friends, setFriends] = useState<JsonObject[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfoRaw = localStorage.getItem("userInfo");
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        friends,
        setFriends,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
