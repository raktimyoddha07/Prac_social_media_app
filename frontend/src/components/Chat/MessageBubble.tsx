import { Box, Text } from "@chakra-ui/react";

const MessageBubble = ({ message }: any) => {
  console.log("CONTENT:", message.content);
  console.log("TYPE:", typeof message.content);

  return (
    <Box bg="red.500" color="white" p={4}>
      <Text fontSize="sm" color="gray.500">
        {message.sender.username}
      </Text>

      <Text color="black">{message.content}</Text>
    </Box>
  );
};

export default MessageBubble;
