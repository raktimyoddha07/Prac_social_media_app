import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { setPosts } from "../features/posts/postSlice";
import Navbar from "../components/Main/Navbar";
import CreatePost from "../components/Post/CreatePost";
import PostCard from "../components/Post/PostCard";
import { getPosts } from "../features/posts/postAPI";
import { getCurrentUser } from "../features/user/userAPI";
import { setUser } from "../features/auth/authSlice";

const Home = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();

      dispatch(setPosts(data));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();

      // console.log("USER FROM API", user);

      dispatch(setUser(user));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <Box maxW="600px" mx="auto" minH="100vh">
        <CreatePost refreshPosts={fetchPosts} />

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </>
  );
};

export default Home;
