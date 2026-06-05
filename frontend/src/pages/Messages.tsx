import { Box, Flex } from "@chakra-ui/react";

import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import Navbar from "../components/Main/Navbar";
import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getConversations } from "../features/chat/chatAPI";
import { setConversations, setSelectedConversation } from "../features/chat/chatSlice";

const Messages = () => {
    const { conversationId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      const loadConversation = async () => {
        try {
          const conversations = await getConversations();

          dispatch(setConversations(conversations));

          if (conversationId) {
            const selected = conversations.find(
              (c: any) => c.id === conversationId,
            );

            if (selected) {
              dispatch(setSelectedConversation(selected));
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadConversation();
    }, [conversationId]);

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
