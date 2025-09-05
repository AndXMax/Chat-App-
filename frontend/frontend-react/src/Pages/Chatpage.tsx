import { Box, Flex } from "@chakra-ui/react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const { user } = ChatState();

  return (
    <Box w="100%" h="100vh" display="flex" flexDirection="column">
      {/* Top Search Bar */}
      {user && <SideDrawer />}
      
      {/* Main Content Area */}
      <Flex flex="1" overflow="hidden">
        {/* Left Sidebar - Friends/Chats */}
        {user && (
          <Box 
            w="300px" 
            borderRightWidth="1px" 
            borderRightColor="gray.200"
            bg="white"
            overflowY="auto"
          >
            <MyChats />
          </Box>
        )}
        
        {/* Right Side - Chatbox */}
        {user && (
          <Box flex="1" overflow="hidden">
            <Chatbox />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Chatpage;