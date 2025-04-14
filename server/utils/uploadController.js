// import cloudinary from "../config/cloudinaryConfig.js";
import sharp from "sharp";
import { Readable } from "stream";
import cloudinary from "./cloudinary.js";

// Function to determine fileType for schema
const getFileType = (mimetype) => {
	if (mimetype.startsWith("image/")) return "IMAGE";
	if (mimetype.startsWith("video/")) return "VIDEO";
	if (
		[
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		].includes(mimetype)
	) {
		return "DOCUMENT"; // PDFs, Word files
	}
	return "DOCUMENT"; // Default to document
};

// Function to upload file to Cloudinary
const uploadFile = async (file) => {
	return new Promise(async (resolve, reject) => {
		try {
			let buffer = file.buffer;
			let resourceType = getFileType(file.mimetype);
			let uploadOptions = {
				folder: "uploads",
				resource_type: resourceType === "IMAGE" ? "image" : "auto",
			};

			// Optimize images using Sharp before upload
			if (resourceType === "IMAGE") {
				buffer = await sharp(file.buffer)
					.resize({ width: 800, height: 800, fit: "inside" })
					.toFormat("jpeg", { quality: 80 })
					.toBuffer();
			}

			// Cloudinary Upload
			const uploadStream = cloudinary.uploader.upload_stream(
				uploadOptions,
				(error, result) => {
					if (error) reject(error);
					else
						resolve({
							fileType: resourceType,
							fileUrl: result.secure_url,
						});
				}
			);

			Readable.from(buffer).pipe(uploadStream);
		} catch (error) {
			reject(error);
		}
	});
};

// Handle multiple file uploads and map to schema
export const uploadMultipleFiles = async (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: "No files uploaded" });
		}

		const uploadedFiles = await Promise.all(
			req.files.map((file) => uploadFile(file))
		);

		console.log(uploadedFiles);
		res.status(200).json({
			message: "Files uploaded successfully",
			resources: uploadedFiles,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "File upload failed", error: error.message });
	}
};
