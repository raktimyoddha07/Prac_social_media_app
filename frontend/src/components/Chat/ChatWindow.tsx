import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMessages } from "../../features/chat/chatAPI";

import {
  addMessage,
  editMessage,
  deleteMessage,
  moveConversationToTop,
  setMessages,
} from "../../features/chat/chatSlice";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

import { socket } from "../../socket/socket";

const ChatWindow = () => {
  const dispatch = useDispatch();

  const selectedConversation = useSelector(
    (state: any) => state.chat.selectedConversation,
  );

  const messages = useSelector((state: any) => state.chat.messages);

  // -------------------------
  // Join Conversation Room
  // -------------------------

  useEffect(() => {
    if (!selectedConversation) return;

    socket.emit("join_conversation", selectedConversation.id);
  }, [selectedConversation]);

  // -------------------------
  // Load Messages
  // -------------------------

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const data = await getMessages(selectedConversation.id);

        dispatch(setMessages(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedConversation, dispatch]);

  // -------------------------
  // Socket Events
  // -------------------------

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log("RECEIVED MESSAGE:", message);
      dispatch(moveConversationToTop(message.conversation_id));

      if (
        selectedConversation &&
        message.conversation_id === selectedConversation.id
      ) {
        dispatch(addMessage(message));
      }
    };

    const handleMessageEdited = (message: any) => {
      if (
        selectedConversation &&
        message.conversation_id === selectedConversation.id
      ) {
        dispatch(editMessage(message));
      }
    };

    const handleMessageDeleted = (data: any) => {
      if (
        selectedConversation &&
        data.conversation_id === selectedConversation.id
      ) {
        dispatch(deleteMessage(data.id));
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    socket.on("message_edited", handleMessageEdited);

    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);

      socket.off("message_edited", handleMessageEdited);

      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [dispatch, selectedConversation]);

  // -------------------------
  // No Conversation Selected
  // -------------------------

  if (!selectedConversation) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center">
        <Text>Select a conversation</Text>
      </Box>
    );
  }

  // -------------------------
  // UI
  // -------------------------

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box flex={1} overflowY="auto" p={4}>
        <VStack align="stretch">
          {messages.map((message: any) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </VStack>
      </Box>

      <MessageInput />
    </Box>
  );
};

export default ChatWindow;
