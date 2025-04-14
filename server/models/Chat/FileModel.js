import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
	filename: {
		type: String,
		required: true,
	},
	cloudinaryId: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	format: {
		type: String,
	},
	size: {
		type: Number,
		required: true,
	},
	fileType: {
		type: String,
		required: true,
	},
	mimetype: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const File = mongoose.model("File", fileSchema);
