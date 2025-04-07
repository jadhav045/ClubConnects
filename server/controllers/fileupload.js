import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for temporary storage
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "club-media",
		format: async (req, file) =>
			file.mimetype.includes("video") ? "mp4" : "jpg",
		public_id: (req, file) => file.originalname.split(".")[0],
	},
});

const upload = multer({ storage });

// Upload route
router.post("/upload", upload.array("files", 5), async (req, res) => {
	try {
		const uploadedFiles = req.files.map((file) => ({
			url: file.path,
			type: file.mimetype.includes("video") ? "video" : "image",
		}));

		res.json({ success: true, urls: uploadedFiles });
	} catch (error) {
		console.error("Upload Error:", error);
		res.status(500).json({ success: false, message: "Upload failed" });
	}
});
export default router;
