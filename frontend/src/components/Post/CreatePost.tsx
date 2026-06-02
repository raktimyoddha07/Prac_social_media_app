import { Box, Button, Textarea, VStack, Input, Image } from "@chakra-ui/react";

import { useState } from "react";

import API from "../../api/axios";

import { createPost } from "../../features/posts/postAPI";

interface Props {
  refreshPosts: () => void;
}

const CreatePost = ({ refreshPosts }: Props) => {
  const [content, setContent] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setSelectedFile(file);

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCreatePost = async () => {
    try {
      let imageUrl = "";

      if (selectedFile) {
        const formData = new FormData();

        formData.append("file", selectedFile);

        const uploadResponse = await API.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = uploadResponse.data.image_url;
      }

      await createPost(content, imageUrl);

      setContent("");

      setSelectedFile(null);

      setPreviewUrl("");

      refreshPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box borderWidth="1px" p={4} borderRadius="lg" mb={5}>
      <VStack>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="preview"
            borderRadius="md"
            maxH="300px"
            objectFit="cover"
            width="100%"
          />
        )}

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
