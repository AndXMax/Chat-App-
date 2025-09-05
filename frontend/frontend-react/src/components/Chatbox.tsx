import { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import { Tooltip } from "@/components/ui/tooltip";

type BasicUser = { _id: string; name?: string; pic?: string };
type Chat = {
  _id: string;
  chatName?: string;
  isGroupChat?: boolean;
  users?: BasicUser[];
} | null;
type Message = {
  _id: string;
  content?: string;
  sender?: BasicUser;
  createdAt?: string;
};

const Chatbox = () => {
  const { user, selectedChat } = ChatState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      const chat = selectedChat as Chat;
      if (!chat?._id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/message/${chat._id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat, user]);

  // socket setup
  useEffect(() => {
    const backendUrl =
      (import.meta as ImportMeta).env?.VITE_BACKEND_URL ||
      "http://localhost:3000";
    const socket = io(backendUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("setup", user);
    socket.on("connected", () => undefined);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message recieved", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // join selected chat room
  useEffect(() => {
    const chat = selectedChat as Chat;
    if (socketRef.current && chat?._id) {
      socketRef.current.emit("join chat", chat._id);
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <Box
        h="100%"
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={6}
      >
        <Text color="gray.500" fontSize="lg" mb={2}>
          Select a chat to start messaging
        </Text>
        <Text color="gray.400" fontSize="sm" textAlign="center">
          Choose a conversation from the sidebar to begin chatting
        </Text>
      </Box>
    );
  }

  const meId = (user as Record<string, unknown> | null)?._id as
    | string
    | undefined;
  const chatName = (selectedChat as Chat)?.isGroupChat
    ? (selectedChat as Chat)?.chatName || "Group Chat"
    : ((selectedChat as Chat)?.users || []).find((u) => u._id !== meId)?.name ||
      "Direct Chat";

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (message: Message) => {
    return message.sender?._id === meId;
  };

  return (
    <Box h="100%" bg="white" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        p={4}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        bg="gray.50"
      >
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          {chatName}
        </Text>
      </Box>

      {/* Messages Area */}
      <Box flex="1" overflowY="auto" p={4} bg="gray.50">
        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="lg" color="blue.500" />
          </Flex>
        ) : messages.length === 0 ? (
          <Flex justify="center" align="center" h="100%">
            <Text color="gray.500" fontSize="md">
              No messages yet. Start the conversation!
            </Text>
          </Flex>
        ) : (
          <Stack gap={3}>
            {/* {messages.map((message) => (
              <Box key={message._id}>
                <Flex
                  justify={isOwnMessage(message) ? "flex-end" : "flex-start"}
                  align="flex-end"
                  gap={2}
                >
                  <Box
                    maxW="70%"
                    bg={isOwnMessage(message) ? "blue.500" : "white"}
                    color={isOwnMessage(message) ? "white" : "gray.800"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    boxShadow="sm"
                    border={!isOwnMessage(message) ? "1px solid" : "none"}
                    borderColor="gray.200"
                  >
                    <Text fontSize="sm" wordBreak="break-word">
                      {message.content || "(empty)"}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={isOwnMessage(message) ? "blue.100" : "gray.500"}
                      mt={1}
                      textAlign="right"
                    >
                      {formatTime(message.createdAt)}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))} */}
            {messages.map((message) => {
              const isMine = isOwnMessage(message);
              return (
                <Box key={message._id}>
                  <Flex
                    justify={isMine ? "flex-end" : "flex-start"}
                    align="flex-end"
                    gap={2}
                  >
                    <Tooltip
                      content={
                        <Box
                          p={2}
                          bg="gray.700"
                          color="white"
                        >
                          <Text fontWeight="bold">{message.sender?.name || "Unknown"}</Text>
                          <Text fontSize="sm" color="gray.300">
                            Sent at: {formatTime(message.createdAt)}
                          </Text>
                          <Text fontSize="xs" mt={2} color="gray.400">
                            This is a dev-only popup!
                          </Text>
                        </Box>
                      }
                      disabled={isMine}
                      openDelay={100}
                      closeDelay={100}
                    >
                      <Box
                        maxW="70%"
                        bg={isMine ? "blue.500" : "white"}
                        color={isMine ? "white" : "gray.800"}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        boxShadow="sm"
                        border={!isMine ? "1px solid" : "none"}
                        borderColor="gray.200"
                        cursor={!isMine ? "pointer" : "default"}
                      >
                        <Text fontSize="sm" wordBreak="break-word">
                          {message.content || "(empty)"}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={isMine ? "blue.100" : "gray.500"}
                          mt={1}
                          textAlign="right"
                        >
                          {formatTime(message.createdAt)}
                        </Text>
                      </Box>
                    </Tooltip>
                  </Flex>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Stack>
        )}

        {isTyping && (
          <Flex justify="flex-start" align="center" gap={2} mt={2}>
            <Box
              bg="white"
              px={4}
              py={2}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.500">
                Typing...
              </Text>
            </Box>
          </Flex>
        )}
      </Box>

      {/* Input Area */}
      {selectedChat && (
        <Box p={4} borderTopWidth="1px" borderTopColor="gray.200" bg="white">
          <Stack direction="row" gap={3}>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              borderRadius="full"
              bg="gray.50"
              _focus={{
                bg: "white",
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
            />
            <Button
              colorScheme="blue"
              borderRadius="full"
              px={6}
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );

  async function sendMessage() {
    const chat = selectedChat as Chat;
    if (!newMessage.trim() || !chat?._id) return;

    const messageToSend = newMessage;
    setNewMessage("");

    try {
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ content: messageToSend, chatId: chat._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data: Message = await response.json();
      setMessages((prev) => [...prev, data]);

      if (socketRef.current) {
        socketRef.current.emit("new message", data);
        socketRef.current.emit("stop typing", chat._id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore the message if sending failed
      setNewMessage(messageToSend);
    }
  }
};

export default Chatbox;
