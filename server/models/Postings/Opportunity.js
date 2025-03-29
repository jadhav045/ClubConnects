import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		type: {
			type: String,
			enum: ["Industry Project", "Internship", "Job", "Research", "Other"],
		},
		registrationForm: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
			default: null,
		},
		alumni: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Alumni",
			required: true,
		},

		currentRound: { type: Number, default: 0 },
		rounds: [
			{
				type: { type: String, required: true },
				testType: { type: String, default: null },
				order: { type: Number, required: true },
				studentIds: {
					type: [mongoose.Schema.Types.ObjectId],
					ref: "User",
					default: [],
				},
			},
		],

		lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
