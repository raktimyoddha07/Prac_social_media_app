import { Box, Image, Text, Button } from "@chakra-ui/react";

import { useDispatch } from "react-redux";

import { likePost, unlikePost } from "../features/likes/likeAPI";

import { toggleLike } from "../features/posts/postSlice";

interface Props {
  post: any;
}

const PostCard = ({ post }: Props) => {
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      if (post.liked_by_user) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      dispatch(toggleLike(post.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box borderWidth="1px" p={4} borderRadius="lg" mb={4}>
      <Text fontWeight="bold" mb={2}>
        {post.user?.username || "User"}
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

      <Text mb={3}>{post.content}</Text>

      <Button
        size="sm"
        colorScheme={post.liked_by_user ? "red" : "gray"}
        onClick={handleLike}
      >
        {post.liked_by_user ? "❤️" : "🤍"} {post.likes_count}
      </Button>
    </Box>
  );
};

export default PostCard;
