import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    counterAmount: Number,
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'countered'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
