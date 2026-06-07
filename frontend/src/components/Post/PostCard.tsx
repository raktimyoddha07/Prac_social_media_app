import { Box, Image, Text, Button, Textarea, Input } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import API from "../../api/axios";

import { likePost} from "../../features/likes/likeAPI";
import { dislikePost } from "../../features/dislike/dislikeAPI";

import {
  toggleLike,
  toggleDislike,
  updatePost as updatePostRedux,
  deletePost as deletePostRedux,
} from "../../features/posts/postSlice";
import { createComment, getComments } from "../../features/comments/commentAPI";

import { updatePost, deletePost } from "../../features/posts/postAPI";

import CommentForm from "../Comment/CreateComment";
import CommentList from "../Comment/CommentCard";




interface PostCardProps {
  post: any;
  onLikeToggle?: (postId: string) => void;
  ondislikeToggle?: (postId: string) => void;
}

const PostCard = ({ post, onLikeToggle, ondislikeToggle }: PostCardProps) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.auth.user);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImageUrl, setEditedImageUrl] = useState(post.image_url || "");
  const [previewImage, setPreviewImage] = useState(post.image_url || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await getComments(post.id);

      setComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleLike = async () => {
    try {
      await likePost(post.id);

      dispatch(toggleLike(post.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      await dislikePost(post.id);

      dispatch(toggleDislike(post.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (commentText: string) => {
    try {
      await createComment(post.id, commentText);

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setSelectedFile(file);

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      let finalImageUrl = editedImageUrl;

      if (selectedFile) {
        const formData = new FormData();

        formData.append("file", selectedFile);

        const uploadResponse = await API.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        finalImageUrl = uploadResponse.data.image_url;
      }

      const updatedPost = await updatePost(post.id, {
        content: editedContent,
        image_url: finalImageUrl,
      });

      dispatch(updatePostRedux(updatedPost));
      setPreviewImage(updatedPost.image_url);
      setEditedImageUrl(updatedPost.image_url);
      setSelectedFile(null);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);

      dispatch(deletePostRedux(post.id));
    } catch (error) {
      console.log(error);
    }
  };

 return (
   <Box
     bg="gray.900"
     border="1px solid"
     borderColor="gray.700"
     borderRadius="xl"
     overflow="hidden"
     mb={6}
     boxShadow="lg"
   >
     {/* Header */}
     <Box
       px={5}
       py={4}
       display="flex"
       justifyContent="space-between"
       alignItems="center"
       borderBottom="1px solid"
       borderColor="gray.700"
     >
       <Text fontWeight="bold" fontSize="lg">
         <Link to={`/profile/${post.user_id}`}>{post.user?.username}</Link>
       </Text>

       {post.user_id === currentUser?.id && !isEditing && (
         <Box position="relative">
           <Button
             size="sm"
             variant="ghost"
             onClick={() => setShowMenu(!showMenu)}
           >
             ⋮
           </Button>

           {showMenu && (
             <Box
               position="absolute"
               right="0"
               top="40px"
               bg="gray.800"
               border="1px solid"
               borderColor="gray.700"
               borderRadius="md"
               overflow="hidden"
               zIndex={100}
               minW="120px"
             >
               <Button
                 w="100%"
                 justifyContent="flex-start"
                 variant="ghost"
                 borderRadius="0"
                 onClick={() => {
                   setIsEditing(true);
                   setShowMenu(false);
                 }}
               >
                 ✏️ Edit
               </Button>

               <Button
                 w="100%"
                 justifyContent="flex-start"
                 variant="ghost"
                 colorScheme="red"
                 borderRadius="0"
                 onClick={() => {
                   handleDelete();
                   setShowMenu(false);
                 }}
               >
                 🗑️ Delete
               </Button>
             </Box>
           )}
         </Box>
       )}
     </Box>

     {/* Normal Post Image */}
     {!isEditing && post.image_url && (
       <Image
         src={post.image_url}
         alt="post"
         width="100%"
         maxH="800px"
         objectFit="contain"
       />
     )}

     {/* Content */}
     <Box p={5}>
       {isEditing ? (
         <>
           {previewImage && (
             <Image
               src={previewImage}
               alt="preview"
               width="100%"
               maxH="700px"
               objectFit="contain"
               borderRadius="lg"
               mb={4}
             />
           )}

           <Input
             type="file"
             accept="image/*"
             onChange={handleFileChange}
             mb={4}
           />

           <Textarea
             value={editedContent}
             onChange={(e) => setEditedContent(e.target.value)}
             placeholder="Write a caption..."
             mb={4}
           />

           <Box display="flex" justifyContent="flex-end" gap={2}>
             <Button colorScheme="green" onClick={handleUpdate}>
               Save
             </Button>

             <Button
               onClick={() => {
                 setIsEditing(false);
                 setShowMenu(false);
               }}
             >
               Cancel
             </Button>
           </Box>
         </>
       ) : (
         <Text fontSize="md" whiteSpace="pre-wrap" lineHeight="1.7">
           {post.content}
         </Text>
       )}
     </Box>

     {/* Footer */}
     <Box
       px={5}
       py={4}
       borderTop="1px solid"
       borderColor="gray.700"
       display="flex"
       gap={3}
       flexWrap="wrap"
     >
       <Button
         size="sm"
         colorScheme={post.liked_by_user ? "red" : "gray"}
         onClick={handleLike}
       >
         {post.liked_by_user ? "❤️" : "🤍"} {post.likes_count}
       </Button>

       <Button
         size="sm"
         colorScheme={post.disliked_by_user ? "red" : "gray"}
         onClick={handleDislike}
       >
         {post.disliked_by_user ? "👎" : "👎🏻"} {post.dislikes_count}
       </Button>

       <Button
         size="sm"
         variant="ghost"
         onClick={() => setShowComments(!showComments)}
       >
         💬 {comments.length}
       </Button>
     </Box>

     {/* Comments */}
     {showComments && (
       <Box p={5} borderTop="1px solid" borderColor="gray.700" bg="gray.950">
         <CommentForm onSubmit={handleComment} />

         <CommentList comments={comments} refreshComments={fetchComments} />
       </Box>
     )}
   </Box>
 );
};

export default PostCard;
