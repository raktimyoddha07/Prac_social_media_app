import { Box, Image, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  likePost,
  unlikePost,
  getLikesCount,
  isPostLiked,
} from "../features/likes/likeAPI";

interface Props {
  post: any;
}

const PostCard = ({ post }: Props) => {
  const [likes, setLikes] = useState(post.likes_count || 0);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      const data = await getLikesCount(post.id);

      setLikes(data.likes);
      const likedData = await isPostLiked(post.id);
      setLiked(likedData.liked);

    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id);

        setLikes((prev) => prev - 1);

        setLiked(false);
      } else {
        await likePost(post.id);

        setLikes((prev) => prev + 1);

        setLiked(true);
      }
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

      {!post.image_url && (
        <Box h="200px" bg="gray.100" borderRadius="md" mb={3} />
      )}

      <Text>{post.content}</Text>

      <Button
        mt={3}
        size="sm"
        colorScheme={liked ? "red" : "gray"}
        onClick={handleLike}
      >
        {liked ? "❤️" : "🤍"} {likes}
      </Button>
    </Box>
  );
};

export default PostCard;
