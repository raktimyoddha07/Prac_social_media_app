import { Box, Text, VStack } from "@chakra-ui/react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../../features/chat/chatAPI";

import {
  setConversations,
  setSelectedConversation,
} from "../../features/chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";


const ConversationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const conversations = useSelector((state: any) => state.chat.conversations);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, []);


  return (
    <VStack align="stretch">
      {conversations.map((conversation: any) => (
        <Box
          key={conversation.id}
          p={4}
          cursor="pointer"
          borderBottom="1px solid"
          borderColor="gray.200"
          onClick={() => {
            dispatch(setSelectedConversation(conversation));
            navigate(`/messages/${conversation.id}`);
          }}
        >
          {/* <Avatar size="sm" src={conversation.other_user.profile_picture} /> */}
          <Text fontWeight="bold">{conversation.other_user.username}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default ConversationList;
