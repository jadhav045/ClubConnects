import express from "express";
import upload from "../../middlewares/multer.js";
import uploadImage, { uploadFile } from "../../utils/fileUpload.js";
import { File } from "./FileModel.js";
const router = express();
router.post("/upload/image", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		console.log("IN backend", req.file);
		// Check if the file is an image
		if (!req.file.mimetype.startsWith("image/")) {
			return res.status(400).json({ message: "File must be an image" });
		}

		// Upload optimized image to Cloudinary
		const uploadResult = await uploadImage(req.file);

		// Create new file record in MongoDB
		const newFile = new File({
			filename: req.file.originalname,
			cloudinaryId: uploadResult.public_id,
			url: uploadResult.secure_url,
			format: uploadResult.format,
			size: uploadResult.bytes,
			fileType: uploadResult.resource_type,
			mimetype: req.file.mimetype,
		});

		// Save file record to database
		await newFile.save();

		// Return success response
		res.status(201).json({
			message: "Image uploaded successfully",
			originalname: req.file.originalname,
			mimetype: req.file.mimetype,
			size: uploadResult.bytes,
			url: uploadResult.secure_url,
			public_id: uploadResult.public_id,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res
			.status(500)
			.json({ message: "Server error during upload", error: error.message });
	}
});

// Upload any file without optimization
router.post("/upload/file", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		// Upload file to Cloudinary
		const uploadResult = await uploadFile(req.file);

		// Create new file record in MongoDB
		const newFile = new File({
			filename: req.file.originalname,
			cloudinaryId: uploadResult.public_id,
			url: uploadResult.secure_url,
			format: uploadResult.format || null,
			size: uploadResult.bytes,
			fileType: uploadResult.resource_type,
			mimetype: req.file.mimetype,
		});

		// Save file record to database
		await newFile.save();

		// Return success response
		res.status(201).json({
			message: "File uploaded successfully",
			originalname: req.file.originalname,
			mimetype: req.file.mimetype,
			size: uploadResult.bytes,
			url: uploadResult.secure_url,
			public_id: uploadResult.public_id,
			fileType: uploadResult.resource_type,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res
			.status(500)
			.json({ message: "Server error during upload", error: error.message });
	}
});

// Upload endpoint that auto-detects file type and routes accordingly
router.post("/upload", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		let uploadResult;

		// Determine if the file is an image to use appropriate upload handler
		if (req.file.mimetype.startsWith("image/")) {
			uploadResult = await uploadImage(req.file);
		} else {
			uploadResult = await uploadFile(req.file);
		}

		// Create new file record in MongoDB
		const newFile = new File({
			filename: req.file.originalname,
			cloudinaryId: uploadResult.public_id,
			url: uploadResult.secure_url,
			format: uploadResult.format || null,
			size: uploadResult.bytes,
			fileType: uploadResult.resource_type,
			mimetype: req.file.mimetype,
		});

		// Save file record to database
		await newFile.save();

		// Return success response
		res.status(201).json({
			message: "File uploaded successfully",
			originalname: req.file.originalname,
			mimetype: req.file.mimetype,
			size: uploadResult.bytes,
			url: uploadResult.secure_url,
			public_id: uploadResult.public_id,
			fileType: uploadResult.resource_type,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res
			.status(500)
			.json({ message: "Server error during upload", error: error.message });
	}
});

// Get all uploaded files
router.get("/files", async (req, res) => {
	try {
		const files = await File.find().sort({ createdAt: -1 });
		res.status(200).json(files);
	} catch (error) {
		console.error("Error fetching files:", error);
		res.status(500).json({ message: "Server error fetching files" });
	}
});

// Get a single file by ID
router.get("/files/:id", async (req, res) => {
	try {
		const file = await File.findById(req.params.id);
		if (!file) {
			return res.status(404).json({ message: "File not found" });
		}
		res.status(200).json(file);
	} catch (error) {
		console.error("Error fetching file:", error);
		res.status(500).json({ message: "Server error fetching file" });
	}
});

// Delete a file
router.delete("/files/:id", async (req, res) => {
	try {
		const file = await File.findById(req.params.id);
		if (!file) {
			return res.status(404).json({ message: "File not found" });
		}

		// Delete from cloudinary
		await cloudinary.uploader.destroy(file.cloudinaryId);

		// Delete from database
		await File.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "File deleted successfully" });
	} catch (error) {
		console.error("Error deleting file:", error);
		res.status(500).json({ message: "Server error deleting file" });
	}
});

export default router;
