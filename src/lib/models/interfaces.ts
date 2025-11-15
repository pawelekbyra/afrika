
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
}

export interface IComment extends Document {
  _id: string;
  content: string;
  author: IUser['_id'];
  slide: string;
  parent: string | null;
}

export type IPopulatedComment = Omit<IComment, 'author'> & {
  author: IUser;
};

export interface CommentData {
  userId: string;
  comId: string;
  fullName: string;
  text: string;
  avatarUrl: string;
  replies?: CommentData[];
}

export interface SubmitActionParams {
  text: string;
  parentOfRepliedCommentId: string | null;
}

export interface EditActionParams {
  text: string;
  comId: string;
}

export interface DeleteActionParams {
  comIdToDelete: string;
}
