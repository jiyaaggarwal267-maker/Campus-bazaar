import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // User selects this after email verification
    college: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: String,

    verifyTokenExpires: Date,

    rating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    interests: {
      type: [String],
      default: [],
    },

    savedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("isTrustedSeller").get(function () {
  return this.totalRatings >= 10 && this.rating >= 4.5;
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verifyToken;
    delete ret.verifyTokenExpires;
    return ret;
  },
});

export default mongoose.model("User", userSchema);