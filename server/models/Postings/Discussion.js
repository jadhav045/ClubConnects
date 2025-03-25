import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: String,
		enum: ["Interview", "Placement", "Gate"],
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	upvotes: { type: Number, default: 0 },
	replies: [
		{
			content: { type: String, required: true },
			author: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			createdAt: { type: Date, default: Date.now },
		},
	],
	createdAt: { type: Date, default: Date.now },
});

export default Discussion = mongoose.model("Discussion", discussionSchema);
