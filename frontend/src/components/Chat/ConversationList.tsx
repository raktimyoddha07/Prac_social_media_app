import { Box, Text, VStack, Avatar, HStack } from "@chakra-ui/react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../../features/chat/chatAPI";

import {
  setConversations,
  setSelectedConversation,
} from "../../features/chat/chatSlice";

import { useNavigate, useParams } from "react-router-dom";


const ConversationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { conversationId } = useParams();

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
  }, [dispatch]);

  return (
    <VStack align="stretch" gap={1} p={2}>
      {conversations.map((conversation: any) => {
        const isSelected = conversationId === conversation.id;

        return (
          <Box
            key={conversation.id}
            p={3}
            borderRadius="lg"
            cursor="pointer"
            transition="all 0.2s"
            bg={isSelected ? "blue.500" : "white"}
            color={isSelected ? "black" : "black"}
            boxShadow={isSelected ? "md" : "none"}
            transform={isSelected ? "scale(1.02)" : "scale(1)"}
            _hover={{
              bg: isSelected ? "blue.600" : "gray.100",
            }}
            onClick={() => {
              dispatch(setSelectedConversation(conversation));
              navigate(`/messages/${conversation.id}`);
            }}
          >
            <HStack gap={3}>
              {/* <Avatar
                size="sm"
                src={conversation.other_user.profile_picture}
                name={conversation.other_user.username}
              /> */}

              <Text fontWeight="semibold">
                {conversation.other_user.username}
              </Text>
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default ConversationList;
