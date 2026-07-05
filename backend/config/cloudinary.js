import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// 🔥 THIS IS REQUIRED (your error is coming from here missing)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;