import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { getUserPosts } from "../features/posts/postAPI";
import PostCard from "../components/Post/PostCard";

const Profile = () => {
  const { id } = useParams();
  const currentUser = useSelector((state: any) => state.auth.user);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/users/${id}`);

        setProfileUser(response.data);

        setUsername(response.data.username);

        setBio(response.data.bio || "");
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

  const handleSave = async () => {
    try {
      const response = await API.put("/users/me", {
        username,
        bio,
      });

      setProfileUser(response.data);

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isOwnProfile = currentUser?.id === profileUser?.id;

  return (
    <Box maxW="800px" mx="auto" mt={8}>
      <Box borderWidth="1px" p={6} borderRadius="lg" mb={6}>
        {isEditing ? (
          <VStack align="stretch">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />

            <Button colorScheme="green" onClick={handleSave}>
              Save
            </Button>

            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </VStack>
        ) : (
          <>
            <Heading size="lg">{profileUser?.username}</Heading>

            <Text color="gray.500">{profileUser?.email}</Text>

            <Text mt={4}>{profileUser?.bio || "No bio yet"}</Text>

            {isOwnProfile && (
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </>
        )}
      </Box>

      <Heading size="md" mb={4}>
        Posts
      </Heading>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default Profile;
