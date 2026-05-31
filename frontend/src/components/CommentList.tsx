import { Box, Text, Button, Textarea } from "@chakra-ui/react";

import { useState } from "react";

import { updateComment, deleteComment } from "../features/comments/commentAPI";

interface Props {
  comments: any[];
  refreshComments: () => void;
}

const CommentList = ({ comments, refreshComments }: Props) => {
  const [editingCommentId, setEditingCommentId] = useState("");

  const [editedText, setEditedText] = useState("");

  const handleUpdate = async (commentId: string) => {
    try {
      await updateComment(commentId, editedText);

      setEditingCommentId("");

      refreshComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);

      refreshComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box mt={3}>
      {comments.map((comment) => (
        <Box key={comment.id} borderWidth="1px" p={2} mb={2} borderRadius="md">
          <Text fontWeight="bold">{comment.user?.username}</Text>

          {editingCommentId === comment.id ? (
            <>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                mb={2}
              />

              <Button
                size="xs"
                colorScheme="green"
                mr={2}
                onClick={() => handleUpdate(comment.id)}
              >
                Save
              </Button>

              <Button size="xs" onClick={() => setEditingCommentId("")}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Text mb={2}>{comment.comment_text}</Text>

              <Button
                size="xs"
                mr={2}
                onClick={() => {
                  setEditingCommentId(comment.id);

                  setEditedText(comment.comment_text);
                }}
              >
                ✏️
              </Button>

              <Button
                size="xs"
                colorScheme="red"
                onClick={() => handleDelete(comment.id)}
              >
                🗑️
              </Button>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
