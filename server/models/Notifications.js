import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	opportunity: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Opportunity",
	},
	type: {
		type: String,
		enum: ["STATUS_UPDATE", "NEW_OPPORTUNITY", "DEADLINE_REMINDER"],
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	metadata: {
		stage: Number,
		status: String,
		feedback: String,
	},
	read: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Notification", notificationSchema);
