import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		eventType: {
			type: String,
			enum: ["CULTURAL", "TECH", "EDUCATION", "SPORTS", "SEMINAR", "SOCIAL", "OTHER"],
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		eventDateTime: {
			type: Date,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		detailedDescription: {
			type: String,
		},
		schedule: [
			{
				time: String,
				activity: String,
			},
		],

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

// Add middleware to check and update registration status
EventSchema.pre("save", function (next) {
	// Check if registration deadline exists and has passed
	if (this.registrationDeadline && new Date() > this.registrationDeadline) {
		this.registrationStatus = "CLOSED";
	}
	next();
});

// Add a static method to update status of all events
EventSchema.statics.updateRegistrationStatuses = async function () {
	const currentDate = new Date();
	await this.updateMany(
		{
			registrationDeadline: { $lt: currentDate },
			registrationStatus: "OPEN",
		},
		{
			$set: { registrationStatus: "CLOSED" },
		}
	);
};

// Add an instance method to check status
EventSchema.methods.isRegistrationOpen = function () {
	if (this.registrationStatus === "CANCELLED") return false;
	if (this.registrationDeadline && new Date() > this.registrationDeadline) {
		this.registrationStatus = "CLOSED";
		this.save();
		return false;
	}
	if (
		this.maxParticipants &&
		this.participants.length >= this.maxParticipants
	) {
		this.registrationStatus = "CLOSED";
		this.save();
		return false;
	}
	return this.registrationStatus === "OPEN";
};

export const Event = mongoose.model("Event", EventSchema);
