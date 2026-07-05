import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Rating from "../models/Rating.js";

// ---------------- GET USER ----------------
export const getUser = async (req, res, next) => {
  try {
    // prevent Mongo crash on invalid id like "me"
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(req.params.id).select(
      "-password -verifyToken"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ---------------- UPDATE PROFILE ----------------
export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "year", "bio", "avatar", "interests"];

    const updates = {};

    allowed.forEach((k) => {
      if (req.body[k] !== undefined && req.body[k] !== null) {
        updates[k] = req.body[k];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -verifyToken");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ---------------- GET USER PRODUCTS ----------------
export const getUserProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.params.id,
      status: { $in: ["available", "reserved"] },
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ---------------- GET USER REVIEWS ----------------
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Rating.find({ seller: req.params.id })
      .populate("rater", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// ---------------- RATE USER ----------------
export const rateUser = async (req, res, next) => {
  try {
    const { productId, rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.status !== "sold") {
      return res.status(400).json({ error: "Can only rate completed sales" });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot rate your own product" });
    }

    const ratingDoc = await Rating.findOneAndUpdate(
      {
        product: productId,
        rater: req.user._id,
      },
      {
        rating,
        review,
        seller: product.seller,
      },
      { upsert: true, new: true }
    );

    res.status(201).json(ratingDoc);
  } catch (err) {
    next(err);
  }
};