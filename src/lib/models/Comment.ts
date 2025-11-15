
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';
import { ISlide } from './Slide';

export interface IComment extends Document {
  content: string;
  author: IUser['_id'];
  slide: ISlide['_id'];
  parent: IComment['_id'] | null;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slide: {
      type: Schema.Types.ObjectId,
      ref: 'Slide',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
