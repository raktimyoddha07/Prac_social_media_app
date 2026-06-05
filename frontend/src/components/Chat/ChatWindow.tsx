import { Box, Text, VStack } from "@chakra-ui/react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMessages } from "../../features/chat/chatAPI";

import { addMessage, setMessages } from "../../features/chat/chatSlice";

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
    console.log("selectedConversation in ChatWindow:", selectedConversation);

    socket.emit("join_conversation", selectedConversation.id);
  }, [selectedConversation]);
  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch]);

 useEffect(() => {
   const fetchMessages = async () => {
     if (!selectedConversation) return;

     try {
       const data = await getMessages(selectedConversation.id);
      console.log("MESSAGES:", data);
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
