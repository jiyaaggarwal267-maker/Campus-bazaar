import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

ratingSchema.index({ product: 1, rater: 1 }, { unique: true });

ratingSchema.statics.calcAverage = async function (sellerId) {
  const stats = await this.aggregate([
    { $match: { seller: sellerId } },
    { $group: { _id: '$seller', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await mongoose.model('User').findByIdAndUpdate(sellerId, {
    rating: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
    totalRatings: stats[0] ? stats[0].count : 0,
  });
};

ratingSchema.post('save', function () {
  this.constructor.calcAverage(this.seller);
});

export default mongoose.model('Rating', ratingSchema);
