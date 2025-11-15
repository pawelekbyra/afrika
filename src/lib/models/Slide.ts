
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISlide extends Document {
  type: 'video' | 'image' | 'iframe';
  src: string;
  title: string;
  author: string;
}

const SlideSchema: Schema<ISlide> = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Typ slajdu jest wymagany.'],
      enum: ['video', 'image', 'iframe'],
    },
    src: {
      type: String,
      required: [true, 'Źródło (URL) jest wymagane.'],
    },
    title: {
      type: String,
      required: [true, 'Tytuł jest wymagany.'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Autor jest wymagany.'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slide: Model<ISlide> = mongoose.models.Slide || mongoose.model<ISlide>('Slide', SlideSchema);

export default Slide;
