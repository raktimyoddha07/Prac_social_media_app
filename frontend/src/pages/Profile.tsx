import { Box, Heading, Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getUserPosts } from "../features/posts/postAPI";

import PostCard from "../components/Post/PostCard";

import API from "../api/axios";
import Navbar from "../components/Main/Navbar";

const Profile = () => {
  const { id } = useParams();

  const [profileUser, setProfileUser] = useState<any>(null);

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/users/${id}`);

        setProfileUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(id!);

        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchProfile();

      fetchPosts();
    }
  }, [id]);

  return (
    <>
    <Navbar/>
      <Box maxW="800px" mx="auto" mt={8}>
        <Box borderWidth="1px" p={6} borderRadius="lg" mb={6}>
          <Heading size="lg">{profileUser?.username}</Heading>

          <Text color="gray.500">{profileUser?.email}</Text>

          <Text mt={4}>{profileUser?.bio || "No bio yet"}</Text>
        </Box>

        <Heading size="md" mb={4}>
          Posts
        </Heading>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </>
  );
};

export default Profile;
