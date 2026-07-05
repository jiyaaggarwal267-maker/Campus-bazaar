import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    negotiable: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair"],
      default: "good",
    },

    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // College selected by the seller during profile completion
    college: {
      type: String,
      required: true,
      trim: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    soldAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Search index
productSchema.index({
  title: "text",
  description: "text",
});

// Filter index
productSchema.index({
  college: 1,
  category: 1,
  status: 1,
  condition: 1,
  price: 1,
});

export default mongoose.model("Product", productSchema);