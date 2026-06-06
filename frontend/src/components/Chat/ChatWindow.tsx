import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMessages } from "../../features/chat/chatAPI";
import {
  addMessage,
  setMessages,
  editMessage,
  deleteMessage,
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

  useEffect(() => {
    if (!selectedConversation) return;

    console.log("JOINING CONVERSATION:", selectedConversation.id);

    socket.emit("join_conversation", selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log("SOCKET MESSAGE:", message);
      

      if (
        selectedConversation &&
        message.conversation_id === selectedConversation.id
      ) {
        dispatch(addMessage(message));
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_edited", (message) => {
      console.log("EDIT EVENT:", message);
      dispatch(editMessage(message));
    });

    socket.on("message_deleted", (data) => {
      console.log("DELETE EVENT:", data);
      dispatch(deleteMessage(data.message_id));
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const data = await getMessages(selectedConversation.id);

        console.log("MESSAGES FROM API:", data);

        dispatch(setMessages(data));
      } catch (error) {
        console.log("GET MESSAGES ERROR:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation, dispatch]);

  if (!selectedConversation) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center">
        <Text>Select a conversation</Text>
      </Box>
    );
  }

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
