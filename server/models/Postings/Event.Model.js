import mongoose from "mongoose";

// Take suggestion from ai to get filled the reports details.

const QuestionSchema = new mongoose.Schema({
	question: String,
	answer: String,
	category: String,
});

const EventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		eventType: {
			type: String,
			enum: [
				"CULTURAL",
				"TECH",
				"EDUCATION",
				"SPORTS",
				"SEMINAR",
				"SOCIAL",
				"OTHER",
			],
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

		summary: { type: String },

		report: {
			type: String,
		},
		// ATTENDANCE
		attendanceCode: String,
		attendanceWindow: {
			start: Date,
			end: Date,
		},

		attendance: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				markedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		isAttendanceOpen: {
			type: Boolean,
			default: false,
		},

		images: {
			group_photo: String,
			intro_photo: String,
		},

		maxParticipants: { type: Number },
	},

	{ timestamps: true }
);

EventSchema.methods.isAttendanceWindowOpen = function () {
	const now = new Date();

	return (
		this.attendanceWindow &&
		this.attendanceWindow.start <= now &&
		this.attendanceWindow.end >= now &&
		this.isAttendanceOpen
	);
};

// Method to mark attendance
EventSchema.methods.markAttendance = async function (userId) {
	// Check if user is registered
	if (!this.participants.includes(userId)) {
		throw new Error("User is not registered for this event");
	}

	// Check if attendance window is open
	if (!this.isAttendanceWindowOpen()) {
		throw new Error("Attendance window is closed");
	}

	// Check if attendance already marked
	const alreadyMarked = this.attendance.some(
		(a) => a.user.toString() === userId.toString()
	);
	if (alreadyMarked) {
		throw new Error("Attendance already marked");
	}

	// Mark attendance
	this.attendance.push({
		user: userId,
		markedAt: new Date(),
	});

	await this.save();
	return true;
};

EventSchema.methods.verifyAttendanceCode = function (code) {
	// console.log("COde", code);
	return this.attendanceCode === code && this.isAttendanceWindowOpen();
};

// Method to set attendance window
EventSchema.methods.setAttendanceWindow = async function (
	startTime,
	endTime,
	code
) {
	this.attendanceWindow = {
		start: startTime,
		end: endTime,
	};
	this.attendanceCode = code;
	this.isAttendanceOpen = true;
	await this.save();
};

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
