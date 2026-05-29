import { Box, Image, Text } from "@chakra-ui/react";

interface Props {
  post: any;
}

const PostCard = ({ post }: Props) => {
  return (
    <Box borderWidth="1px" p={4} borderRadius="lg" mb={4}>
      <Text fontWeight="bold" mb={2}>
        {post.user?.username}
      </Text>

      {post.image_url && (
        <Image
          src={post.image_url}
          alt="post"
          borderRadius="md"
          mb={3}
          maxH="300px"
          objectFit="cover"
          width="100%"
        />
      )}

      {!post.image_url && (
        <Box h="200px" bg="gray.100" borderRadius="md" mb={3} />
      )}

      <Text>{post.content}</Text>
    </Box>
  );
};

export default PostCard;
