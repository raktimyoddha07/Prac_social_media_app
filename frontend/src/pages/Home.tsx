import { Box } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import CreatePost from "../components/CreatePost";

import PostCard from "../components/PostCard";

import { getPosts } from "../features/posts/postAPI";

const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();

      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />

      <Box maxW="600px" mx="auto">
        <CreatePost refreshPosts={fetchPosts} />

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </>
  );
};

export default Home;
