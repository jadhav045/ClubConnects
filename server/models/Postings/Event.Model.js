import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		eventType: {
			type: String,
			enum: ["CULTURAL", "TECH", "EDUCATION", "SPORTS", "SEMINAR", "OTHER"],
			required: true,
		},

		resources: [
			{
				fileType: {
					type: String,
					enum: ["IMAGE", "VIDEO", "DOCUMENT", "URL"], // Allowed file types
					required: true,
				},
				fileUrl: { type: String, required: true }, // The file or URL link
				description: { type: String }, // Optional description
			},
		],

		eventDate: { type: Date, required: true },
		location: { type: String },
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
		feedbackForms: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "FeedbackForm",
			},
		], // List of feedback forms related to the event
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default mongoose.model("Event", eventSchema);
