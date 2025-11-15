
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IDonation extends Document {
  user: IUser['_id'];
  paymentIntentId: string;
  amount: number;
  currency: string;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Donation: Model<IDonation> = mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);

export default Donation;
