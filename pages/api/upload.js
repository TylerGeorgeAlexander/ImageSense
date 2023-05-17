// pages/api/upload.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "ImageSense",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

const upload = multer({ storage: cloudinaryStorage }).single("image");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // This will be the url of the uploaded image on cloudinary
      const imageUrl = req.file.path;
      return res.status(200).json({ imageUrl });
    });
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
