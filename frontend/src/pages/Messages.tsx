import { Box, Flex } from "@chakra-ui/react";

import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import Navbar from "../components/Main/Navbar";
import { useEffect } from "react";
import { socket } from "../socket/socket";

const Messages = () => {
    useEffect(() => {
      socket.connect();

      return () => {
        socket.disconnect();
      };
    }, []);
  return (
    <>
    <Navbar/>
      <Flex h="100vh">
        <Box w="350px" borderRight="1px solid" borderColor="gray.200">
          <ConversationList />
        </Box>

        <Box flex={1}>
          <ChatWindow />
        </Box>
      </Flex>
    </>
  );
};

export default Messages;
