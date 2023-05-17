// pages/api/upload.js
import nextConnect from "next-connect";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import User from "../../models/User";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "your_folder_name",
  },
});

const upload = multer({ storage });

export default nextConnect()
  .use(upload.single("image"))
  .post(async (req, res) => {
    try {
      // Add the Cloudinary URL to the user's imageUrls array
      const user = await User.findById(req.user.id);
      user.imageUrls.push(req.file.path);
      await user.save();
      res.status(200).json({ success: true, imageUrl: req.file.path });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
