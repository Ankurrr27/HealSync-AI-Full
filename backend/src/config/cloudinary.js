import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "healsync_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const upload = multer({ storage });
export { cloudinary };
