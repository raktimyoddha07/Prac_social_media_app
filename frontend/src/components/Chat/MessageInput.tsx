import { Box, Button, Input } from "@chakra-ui/react";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { sendMessage } from "../../features/chat/chatAPI";

import { socket } from "../../socket/socket";
import { addMessage } from "../../features/chat/chatSlice";

const MessageInput = () => {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");

  const selectedConversation = useSelector(
    (state: any) => state.chat.selectedConversation,
  );
  
  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const message = await sendMessage(selectedConversation.id, content);

      dispatch(addMessage(message));

      socket.emit("send_message", message);

      setContent("");
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error);
    }
  };

  return (
    <Box p={4} display="flex" gap={2}>
      <Input value={content} onChange={(e) => setContent(e.target.value)} />

      <Button onClick={handleSend}>Send</Button>
    </Box>
  );
};

export default MessageInput;
