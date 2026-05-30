import { Button, HStack, Input } from "@chakra-ui/react";

import { useState } from "react";

interface Props {
  onSubmit: (commentText: string) => void;
}

const CommentForm = ({ onSubmit }: Props) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;

    onSubmit(comment);

    setComment("");
  };

  return (
    <HStack mt={3}>
      <Input
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button colorScheme="blue" onClick={handleSubmit}>
        Comment
      </Button>
    </HStack>
  );
};

export default CommentForm;
