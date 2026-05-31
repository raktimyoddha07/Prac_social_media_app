import { Box, Image, Text, Button, Textarea } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { likePost, unlikePost } from "../features/likes/likeAPI";

import {
  toggleLike,
  updatePost as updatePostRedux,
  deletePost as deletePostRedux,
} from "../features/posts/postSlice";

import { createComment, getComments } from "../features/comments/commentAPI";

import { updatePost, deletePost } from "../features/posts/postAPI";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface Props {
  post: any;
}

const PostCard = ({ post }: Props) => {
  const dispatch = useDispatch();

  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editedContent, setEditedContent] = useState(post.content);

  const [editedImageUrl, setEditedImageUrl] = useState(post.image_url || "");

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

  const handleComment = async (commentText: string) => {
    try {
      await createComment(post.id, commentText);

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = await updatePost(post.id, {
        content: editedContent,
        image_url: editedImageUrl,
      });

      dispatch(updatePostRedux(updatedPost));

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
    <Box borderWidth="1px" p={4} borderRadius="lg" mb={4}>
      <Text fontWeight="bold" mb={2}>
        {post.user?.username}
      </Text>

      <Box mb={3}>
        {isEditing ? (
          <>
            <Button size="sm" colorScheme="green" mr={2} onClick={handleUpdate}>
              Save
            </Button>

            <Button size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" mr={2} onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </Button>

            <Button size="sm" colorScheme="red" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </>
        )}
      </Box>

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

      {isEditing ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            mb={3}
          />

          <Textarea
            value={editedImageUrl}
            onChange={(e) => setEditedImageUrl(e.target.value)}
            placeholder="Image URL"
            mb={3}
          />
        </>
      ) : (
        <Text mb={3}>{post.content}</Text>
      )}

      <Box mt={3}>
        <Button
          size="sm"
          mr={2}
          colorScheme={post.liked_by_user ? "red" : "gray"}
          onClick={handleLike}
        >
          {post.liked_by_user ? "❤️" : "🤍"} {post.likes_count}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length}
        </Button>
      </Box>

      {showComments && (
        <Box mt={4}>
          <CommentForm onSubmit={handleComment} />

          <CommentList comments={comments} refreshComments={fetchComments} />
        </Box>
      )}
    </Box>
  );
};

export default PostCard;
