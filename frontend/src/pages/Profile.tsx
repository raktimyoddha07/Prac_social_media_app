import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  VStack,
  Image,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../api/axios";
import { getUserPosts } from "../features/posts/postAPI";
import { setPosts } from "../features/posts/postSlice";
import PostCard from "../components/Post/PostCard";
import Navbar from "../components/Main/Navbar";
import {
  setProfileUser,
  updateProfileUser,
} from "../features/profile/profileSlice"
import { getProfile, updateProfile } from "../features/profile/profileAPI";
import { setUser } from "../features/auth/authSlice";
import { createConversation } from "../features/chat/chatAPI";
import { setSelectedConversation, addConversation } from "../features/chat/chatSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const profileUser = useSelector((state: any) => state.profile.profileUser);
  const currentUser = useSelector((state: any) => state.auth.user);
  const posts = useSelector((state: any) => state.posts.posts);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(id!);

        dispatch(setProfileUser(data));

        setUsername(data.username);

        setBio(data.bio || "");
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(id!);

        dispatch(setPosts(data));
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchProfile();
      fetchPosts();
    }
  }, [id, dispatch]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.length) return;

    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      let imageUrl = profileUser?.profile_picture || "";

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

      const updatedUser = await updateProfile({
        username,
        bio,
        profile_picture: imageUrl,
      });

      dispatch(updateProfileUser(updatedUser));

      if (currentUser?.id === updatedUser.id) {
        dispatch(setUser(updatedUser));
      }

      setSelectedFile(null);

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isOwnProfile = currentUser?.id === profileUser?.id;

  const handleMessage = async () => {
    try {
      const conversation = await createConversation(profileUser.id);
      dispatch(addConversation(conversation));
      navigate(`/messages/${conversation.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <Navbar />

      <Box maxW="800px" mx="auto" mt={8} minH="100vh">
        <Box borderWidth="1px" p={6} borderRadius="lg" mb={6}>
          {isEditing ? (
            <VStack align="stretch">
              <Input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />

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
              <Image
                src={
                  profileUser?.profile_picture ||
                  `https://ui-avatars.com/api/?name=${profileUser?.username}`
                }
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                mx="auto"
                mb={4}
              />

              <Heading size="lg">{profileUser?.username}</Heading>

              <Text color="gray.500">{profileUser?.email}</Text>

              <Text mt={4}>{profileUser?.bio || "No bio yet"}</Text>

              {isOwnProfile ? (
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button mt={4} colorScheme="blue" onClick={handleMessage}>
                  Message
                </Button>
              )}
            </>
          )}
        </Box>

        <Heading size="md" mb={4}>
          Posts
        </Heading>

        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </>
  );
};

export default Profile;
