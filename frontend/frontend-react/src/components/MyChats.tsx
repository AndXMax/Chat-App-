import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Text, Stack, Badge } from "@chakra-ui/react";

const MyChats = () => {
  const { user, chats, setChats, setSelectedChat, friends } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch(`/api/chat`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      setChats(data);
    };
    if (user) fetchChats();
  }, [user, setChats]);

  type BasicUser = { _id: string; name?: string; pic?: string };
  type ChatItem = { _id: string; isGroupChat?: boolean; chatName?: string; users?: BasicUser[] };
  const safeChats: ChatItem[] = Array.isArray(chats) ? (chats as ChatItem[]) : [];
  const hasChats = safeChats.length > 0;

  const getChatName = (chat: ChatItem): string => {
    if (chat.isGroupChat) return chat.chatName || "Group Chat";
    const meId = (user as Record<string, unknown> | null)?._id as string | undefined;
    const other = (chat.users || []).find((u) => u._id !== meId);
    return other?.name || "Direct Chat";
  };

  const getChatAvatar = (chat: ChatItem): string | undefined => {
    if (chat.isGroupChat) return undefined;
    const meId = (user as Record<string, unknown> | null)?._id as string | undefined;
    const other = (chat.users || []).find((u) => u._id !== meId);
    return other?.pic;
  };

  return (
    <Box h="100%" p={4}>
      {/* Header */}
      <Box mb={4} pb={3} borderBottomWidth="1px" borderBottomColor="gray.200">
        <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={2}>
          My Chats
        </Text>
        {friends.length > 0 && (
          <Stack direction="row" gap={2}>
            <Badge colorScheme="green" variant="subtle">
              {friends.length} Friends
            </Badge>
          </Stack>
        )}
      </Box>

      {/* Chats List */}
      <Stack gap={2}>
        {!hasChats && (
          <Box 
            p={4} 
            textAlign="center" 
            bg="gray.50" 
            borderRadius="md"
            border="1px dashed"
            borderColor="gray.300"
          >
            <Text color="gray.500" fontSize="sm">
              No chats yet. Start a conversation from the search bar above.
            </Text>
          </Box>
        )}
        
        {hasChats && safeChats.map((chat) => (
          <Box
            key={chat._id}
            p={3}
            borderRadius="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ 
              bg: "blue.50", 
              borderColor: "blue.200",
              cursor: "pointer",
              transform: "translateY(-1px)",
              boxShadow: "sm"
            }}
            transition="all 0.2s"
            onClick={() => setSelectedChat(chat as unknown as Record<string, unknown>)}
          >
            <Stack direction="row" gap={3}>
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg={chat.isGroupChat ? "purple.500" : "blue.500"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="xs"
                fontWeight="bold"
              >
                {getChatAvatar(chat) ? (
                  <img 
                    src={getChatAvatar(chat)}
                    alt={getChatName(chat)}
                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  getChatName(chat).charAt(0).toUpperCase()
                )}
              </Box>
              <Box flex="1" minW={0}>
                <Text 
                  fontWeight="medium" 
                  fontSize="sm" 
                  color="gray.700"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {getChatName(chat)}
                </Text>
                {chat.isGroupChat && (
                  <Badge size="sm" colorScheme="purple" variant="subtle">
                    Group
                  </Badge>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MyChats;
