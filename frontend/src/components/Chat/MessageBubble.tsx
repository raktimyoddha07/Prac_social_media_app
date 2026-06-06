import { Box, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const MessageBubble = ({ message }: any) => {
  const currentUser = useSelector((state: any) => state.auth.user);

  const isMine = currentUser?.id === message.sender.id;

  return (
    <Box
      display="flex"
      justifyContent={isMine ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Box
        maxW="70%"
        px={4}
        py={2}
        borderRadius="lg"
        bg={isMine ? "green.400" : "blue.400"}
        color="white"
      >
        <Text fontSize="sm" fontWeight="bold">
          {message.sender.username}
        </Text>

        <Text>{message.content}</Text>
      </Box>
    </Box>
  );
};

export default MessageBubble;
