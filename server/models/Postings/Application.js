import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
	{
		opportunity: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Opportunity",
			required: true,
		},
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// 🔹 Tracks student’s current round
		currentRound: { type: Number, default: 0 },

		status: {
			type: String,
			enum: ["In Progress", "Selected", "Rejected"],
			default: "In Progress",
		},

		// 🔹 Stores each round’s result
		results: [
			{
				roundNumber: Number,
				roundType: String,
				status: { type: String, enum: ["Passed", "Rejected"] },
				feedback: String,
			},
		],
	},
	{ timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
