import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: String,
		enum: [
			"Interview Experience",
			"Roadmap",
			"Career",
			"Q&A",
			"Events",
			"Project Showcase",
			"Hackathons",
			"General Advice",
			"Placement",
			"Other",
		],
	},

	// Placement , Carrer & Interview , Question & Answers
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	appreciations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	comments: [
		{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			text: { type: String, required: true },

			timestamp: { type: Date, default: Date.now },
			replies: [
				{
					userId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					text: { type: String, required: true },
					timestamp: { type: Date, default: Date.now },
				},
			],
		},
	],
	createdAt: { type: Date, default: Date.now },
});

export const Discussion = mongoose.model("Discussion", discussionSchema);
