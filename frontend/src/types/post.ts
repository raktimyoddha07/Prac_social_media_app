import { User } from "./auth";

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  user?: User;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
}

export interface UpdatePostData {
  content: string;
}
