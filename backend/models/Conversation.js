import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    buyerUnread: { type: Number, default: 0 },
    sellerUnread: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ buyer: 1, seller: 1, product: 1 }, { unique: true });

export default mongoose.model('Conversation', conversationSchema);
