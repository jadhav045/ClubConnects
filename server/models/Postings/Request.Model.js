import mongoose from "mongoose";
const RequestSchema = new mongoose.Schema(
	{
		clubId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Club",
			required: true,
		},

		requestType: {
			type: String,
			enum: [
				"Event Approval",
				"Resource Request",
				"Membership Request",
				"Other",
			], 
			required: true,
		},

		title: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		justification: { type: String, required: true, trim: true },
		submittedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: { type: Date },
		location: { type: String },
		submissionDate: { type: Date, default: Date.now },
		attachments: [
			{
				fileName: { type: String },
				fileUrl: { type: String },
				uploadedAt: { type: Date, default: Date.now },
			},
		],
		requestStatus: {
			type: String,
			enum: ["Pending", "Approved", "Rejected", "In Review", "ReSumbit"],
			default: "Pending",
		},
		comments: [
			{
				commentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				commentText: { type: String },
				timestamp: { type: Date, default: Date.now },
			},
		],
		uniqueRequestId: { type: String, unique: true },
	},

	{ timestamps: true }
);

export const Request = mongoose.model("Request", RequestSchema);
