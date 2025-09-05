import { Box, Flex, Input, Button, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect, useState } from "react";

const SideDrawer = () => {
  const { user, friends, setFriends, setChats, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  type BasicUser = { _id: string; name?: string };
  const [results, setResults] = useState<BasicUser[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch(`/api/friends`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setFriends(data);
    };
    if (user) fetchFriends();
  }, [user, setFriends]);

  const handleSearch = async () => {
    if (!search) return;
    const res = await fetch(`/api/user?search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  };

  const addFriend = async (friendId: string) => {
    const res = await fetch(`/api/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ friendId }),
    });
    const data = await res.json();
    setFriends(data);
  };

  const accessChat = async (userId: string) => {
    const response = await fetch(`/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    setChats((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      type HasId = { _id?: string };
      const currWithId = current as unknown as HasId[];
      const newWithId = data as unknown as HasId;
      const exists = currWithId.some((c) => c._id === newWithId._id);
      const next = exists ? current : [data, ...current];
      return next;
    });
    setSelectedChat(data as unknown as Record<string, unknown>);
  };

  const userName = ((user as unknown) as Record<string, unknown> | null)?.name as string | undefined;

  return (
    <Box w="100%" bg="gray.50" borderBottomWidth="1px" p={3}>
      <Flex align="center" justify="space-between" gap={3}>
        <Text fontWeight="bold">Chat App</Text>
        <Flex gap={2} flex="1" maxW="500px">
          <Input
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
          <Button onClick={handleSearch}>Search</Button>
        </Flex>
        <Text>{user ? (userName || "User") : "Guest"}</Text>
      </Flex>
      {/* Simple results dropdown */}
      {results.length > 0 && (
        <Box mt={2} bg="white" borderWidth="1px" borderRadius="md" p={2}>
          {results.map((r) => (
            <Flex key={r._id} align="center" justify="space-between" mb={1}>
              <Text>{r.name}</Text>
              <Flex gap={2}>
                <Button size="xs" onClick={() => addFriend(r._id)}>Add</Button>
                <Button size="xs" onClick={() => accessChat(r._id)}>Chat</Button>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
      {/* Simple friends bar */}
      {friends.length > 0 && (
        <Flex mt={2} gap={2} wrap="wrap">
          {(friends as BasicUser[]).map((f) => (
            <Button key={f._id} size="xs" onClick={() => accessChat(f._id)}>{f.name || "Friend"}</Button>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default SideDrawer;
