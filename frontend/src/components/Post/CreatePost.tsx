import { Box, Button, Textarea, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { createPost } from "../../features/posts/postAPI";

interface Props {
  refreshPosts: () => void;
}

const CreatePost = ({ refreshPosts }: Props) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreatePost = async () => {
    try {
      await createPost(content, imageUrl);

      setContent("");
      setImageUrl("");

      refreshPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box borderWidth="1px" p={4} borderRadius="lg" mb={5}>
      <VStack>
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          mb={3}
        />
        <Textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button colorScheme="blue" onClick={handleCreatePost}>
          Post
        </Button>
      </VStack>
    </Box>
  );
};

export default CreatePost;
