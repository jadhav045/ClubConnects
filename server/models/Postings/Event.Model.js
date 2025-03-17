import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		eventType: {
			type: String,
			enum: ["CULTURAL", "TECH", "EDUCATION", "SPORTS", "SEMINAR", "OTHER"],
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		detailedDescription: {
			type: String,
		},
		eventDateTime: {
			type: Date,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		schedule: [
			{
				time: String,
				activity: String,
				speaker: {
					name: String,
					title: String,
					photo: String,
				},
			},
		],
		resources: [
			{
				fileType: {
					type: String,
					// enum: ["IMAGE", "VIDEO", "DOCUMENT", "URL"], // Allowed file types
					required: true,
				},
				fileUrl: { type: String, required: true }, // The file or URL link
				description: { type: String }, // Optional description
			},
		],
		organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Club",
			required: true,
		},
		participants: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		registrationDeadline: { type: Date },
		registrationStatus: {
			type: String,
			enum: ["OPEN", "CLOSED", "CANCELLED"],
			default: "OPEN",
		},
		// In your Event model
		registrationForm: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
			default: null,
		},
		feedbackForm: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
			default: null,
		},

		requestUniqueId: { type: String, required: true, unique: true },

		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
		tags: {
			type: [String],
			default: [],
		},
		maxParticipants: { type: Number },
	},

	{ timestamps: true }
);
export const Event = mongoose.model("Event", EventSchema);

// Let me know if you want me to add anything else! 🚀
