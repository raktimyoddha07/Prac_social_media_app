import { Box, Text, Button, Textarea } from "@chakra-ui/react";

import { useState } from "react";
import { Link } from "react-router-dom";

import {
  updateComment,
  deleteComment,
} from "../../features/comments/commentAPI";
import { useSelector } from "react-redux";

interface Props {
  comments: any[];
  refreshComments: () => void;
}

const CommentList = ({ comments, refreshComments }: Props) => {
  const [editingCommentId, setEditingCommentId] = useState("");

  const [editedText, setEditedText] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");

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
  const currentUser = useSelector((state: any) => state.auth.user);

  return (
    <Box mt={3}>
      {comments.map((comment) => (
        <Box
          key={comment.id}
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          p={3}
          mb={3}
          borderRadius="lg"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Link to={`/profile/${comment.user_id}`}>
              <Text fontWeight="bold" color="white">
                {comment.user?.username}
              </Text>
            </Link>

            {comment.user_id === currentUser?.id &&
              editingCommentId !== comment.id && (
                <Box position="relative">
                  <Button
                    size="xs"
                    variant="ghost"
                    minW="auto"
                    p={1}
                    onClick={() =>
                      setOpenMenuId(openMenuId === comment.id ? "" : comment.id)
                    }
                  >
                    ⋮
                  </Button>

                  {openMenuId === comment.id && (
                    <Box
                      position="absolute"
                      right="0"
                      top="28px"
                      bg="gray.900"
                      border="1px solid"
                      borderColor="gray.700"
                      borderRadius="md"
                      overflow="hidden"
                      zIndex={100}
                      minW="120px"
                    >
                      <Button
                        w="100%"
                        justifyContent="flex-start"
                        variant="ghost"
                        borderRadius="0"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditedText(comment.comment_text);
                          setOpenMenuId("");
                        }}
                      >
                        ✏️ Edit
                      </Button>

                      <Button
                        w="100%"
                        justifyContent="flex-start"
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="0"
                        onClick={() => {
                          handleDelete(comment.id);
                          setOpenMenuId("");
                        }}
                      >
                        🗑️ Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
          </Box>

          {editingCommentId === comment.id ? (
            <>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                mb={3}
              />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleUpdate(comment.id)}
                >
                  Save
                </Button>

                <Button size="sm" onClick={() => setEditingCommentId("")}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Text color="gray.200">{comment.comment_text}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
