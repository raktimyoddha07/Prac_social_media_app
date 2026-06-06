import { Box, Text, Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket/socket";

const MessageBubble = ({ message }: any) => {
  const currentUser = useSelector((state: any) => state.auth.user);

  const isMine = currentUser?.id === message.sender.id;

  const [editing, setEditing] = useState(false);

  const [content, setContent] = useState(message.content);

  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    socket.emit("edit_message", {
      message_id: message.id,
      content,
    });

    setEditing(false);
  };

  const handleDelete = () => {
    socket.emit("delete_message", {
      message_id: message.id,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent={isMine ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Box
        position="relative"
        maxW={{
          base: "85%",
          md: "70%",
        }}
        px={4}
        py={2}
        borderRadius="lg"
        bg={isMine ? "green.500" : "blue.500"}
        color="white"
        whiteSpace="pre-wrap"
        overflowWrap="anywhere"
        wordBreak="normal"
      >
        {isMine && !editing && (
          <Box
            position="absolute"
            top="4px"
            right="8px"
            cursor="pointer"
            fontSize="18px"
            fontWeight="bold"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </Box>
        )}

        {showMenu && (
          <VStack
            position="absolute"
            top="28px"
            right="8px"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            p={2}
            zIndex={100}
          >
            <Button
              size="xs"
              width="100%"
              onClick={() => {
                setEditing(true);
                setShowMenu(false);
              }}
            >
              Edit
            </Button>

            <Button
              size="xs"
              width="100%"
              colorScheme="red"
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
            >
              Delete
            </Button>
          </VStack>
        )}

        {editing ? (
          <>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              bg="white"
              color="black"
              mb={2}
              mt={6}
            />

            <Button size="xs" mr={2} onClick={handleSave}>
              Save
            </Button>

            <Button size="xs" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Text pr={6}>{message.content}</Text>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;
