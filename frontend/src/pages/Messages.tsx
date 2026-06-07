import { Box, Flex } from "@chakra-ui/react";

import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import Navbar from "../components/Main/Navbar";

import { useEffect } from "react";
import { socket } from "../socket/socket";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../features/chat/chatAPI";

import {
  setConversations,
  setSelectedConversation,
} from "../features/chat/chatSlice";

const Messages = () => {
  const { conversationId } = useParams();

  const dispatch = useDispatch();

  const conversations = useSelector((state: any) => state.chat.conversations);

  // Load conversations only once
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();

        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };

    loadConversations();
  }, [dispatch]);

  // Update selected conversation when URL changes
  useEffect(() => {
    if (!conversationId) return;

    const selected = conversations.find((c: any) => c.id === conversationId);

    if (selected) {
      dispatch(setSelectedConversation(selected));
    }
  }, [conversationId, conversations, dispatch]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />

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
