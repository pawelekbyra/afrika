
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';
import { ISlide } from './Slide';

export interface ILike extends Document {
  user: IUser['_id'];
  slide: ISlide['_id'];
}

const LikeSchema: Schema<ILike> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slide: {
      type: Schema.Types.ObjectId,
      ref: 'Slide',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

LikeSchema.index({ user: 1, slide: 1 }, { unique: true });

const Like: Model<ILike> = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);

export default Like;
