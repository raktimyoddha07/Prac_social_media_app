import { Box, Text } from "@chakra-ui/react";

const MessageBubble = ({ message }: any) => {
  return (
    <Box bg="gray.100" p={3} borderRadius="md">
      <Text fontSize="sm">{message.sender?.username}</Text>

      <Text>{message.content}</Text>
    </Box>
  );
};

export default MessageBubble;
