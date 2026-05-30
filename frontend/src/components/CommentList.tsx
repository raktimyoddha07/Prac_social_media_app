import { Box, Text } from "@chakra-ui/react";

interface Props {
  comments: any[];
}

const CommentList = ({ comments }: Props) => {
  return (
    <Box mt={3}>
      {comments.map((comment) => (
        <Box key={comment.id} borderWidth="1px" p={2} mb={2} borderRadius="md">
          <Text fontWeight="bold">{comment.user.username}</Text>
          <Text>{comment.comment_text}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
