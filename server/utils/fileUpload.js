import sharp from "sharp";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file) => {
	try {
		if (!file) {
			throw new Error("No file provided");
		}

		// Optimize image using Sharp
		const optimizedImageBuffer = await sharp(file.buffer)
			.resize({ width: 800, height: 800, fit: "inside" })
			.toFormat("jpeg", { quality: 80 })
			.toBuffer();

		// Upload optimized image to Cloudinary
		const cloudResponse = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "uploads", resource_type: "auto" }, // Auto-detect type
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			Readable.from(optimizedImageBuffer).pipe(uploadStream);
		});

		return { fileUrl: cloudResponse.secure_url };
	} catch (error) {
		console.error("Upload Error:", error);
		throw new Error("File upload failed");
	}
};

export const uploadFile = async (file) => {
	try {
		if (!file) {
			throw new Error("No file provided");
		}
		console.log("FILE A ", file);

		// Upload file to Cloudinary (no transformation)
		const cloudResponse = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "uploads", // Optional: customize folder
					resource_type: "raw", // Important: allow any file type
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			Readable.from(file.buffer).pipe(uploadStream);
		});

		return { fileUrl: cloudResponse.secure_url };
	} catch (error) {
		console.error("File Upload Error:", error);
		throw new Error("File upload failed");
	}
};

export const uploadMultipleFiles = async (req, res) => {
	try {
		console.log(req.files);
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: "No files uploaded" });
		}

		// Upload each file to Cloudinary
		const uploadedUrls = await Promise.all(
			req.files.map(async (file) => await uploadImage(file))
		);

		console.log(uploadedUrls);
		res
			.status(200)
			.json({ message: "Files uploaded successfully", urls: uploadedUrls });
	} catch (error) {
		res
			.status(500)
			.json({ message: "File upload failed", error: error.message });
	}
};
export default uploadImage;
