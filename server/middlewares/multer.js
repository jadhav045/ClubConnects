import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
	fileFilter: (req, file, cb) => {
		// Allow only images, PDFs, and videos
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"application/pdf",
			"video/mp4",
		];
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Invalid file type"), false);
		}
		cb(null, true);
	},
});

export default upload;
