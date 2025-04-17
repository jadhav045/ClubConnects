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

// Simple Report
EventSchema.methods.generateEventReport = async function () {
	try {
		// Safely populate data with error handling
		const event = await this.populate([
			{ path: "participants" },
			{ path: "attendance.user" },
			{ path: "feedbackForm", populate: "responses" },
		]).catch((err) => {
			console.error("Population error:", err);
			return this;
		});

		// Safe get function to handle undefined/null values
		const safe = (fn) => {
			try {
				return fn();
			} catch (e) {
				return null;
			}
		};

		// Basic stats with null checks
		const stats = {
			title: this.title || "Untitled Event",
			eventType: this.eventType || "Not Specified",
			date: this.eventDateTime || new Date(),
			location: this.location || "Location not specified",

			registration: {
				total: this.participants?.length || 0,
				maxCapacity: this.maxParticipants || "Unlimited",
				registrationRate: safe(() => {
					if (!this.maxParticipants) return "No limit set";
					if (!this.participants?.length) return "0%";
					return `${(
						(this.participants.length / this.maxParticipants) *
						100
					).toFixed(1)}%`;
				}),
			},

			attendance: {
				total: this.attendance?.length || 0,
				attendanceRate: safe(() => {
					if (!this.attendance?.length || !this.participants?.length)
						return "0%";
					return `${(
						(this.attendance.length / this.participants.length) *
						100
					).toFixed(1)}%`;
				}),
				onTime: safe(() => {
					if (!this.attendance?.length || !this.eventDateTime) return 0;
					return this.attendance.filter(
						(a) => new Date(a?.markedAt || 0) <= new Date(this.eventDateTime)
					).length;
				}),
				late: safe(() => {
					if (!this.attendance?.length || !this.eventDateTime) return 0;
					return this.attendance.filter(
						(a) => new Date(a?.markedAt || 0) > new Date(this.eventDateTime)
					).length;
				}),
			},

			feedback: {
				form: safe(() => {
					if (!this.feedbackForm) return "No feedback form attached";
					const responses = this.feedbackForm.responses?.length || 0;
					const attendees = this.attendance?.length || 0;
					return {
						totalResponses: responses,
						responseRate: attendees
							? `${((responses / attendees) * 100).toFixed(1)}%`
							: "0%",
					};
				}),
			},

			timeline: {
				created: this.createdAt || "Date not recorded",
				registrationDeadline: this.registrationDeadline || null,
				eventDate: this.eventDateTime || "Date not set",
				status: this.registrationStatus || "Status not set",
			},

			resources: {
				totalCount: this.resources?.length || 0,
				types: safe(() => {
					if (!this.resources?.length) return {};
					return this.resources.reduce((acc, resource) => {
						if (resource?.fileType) {
							acc[resource.fileType] = (acc[resource.fileType] || 0) + 1;
						}
						return acc;
					}, {});
				}),
			},

			schedule: this.schedule?.length > 0 ? this.schedule : null,
		};

		// Format the report as a string with safe interpolation
		const report = `
  Event Report: ${stats.title}
  ==========================================
  Type: ${stats.eventType}
  Date: ${
		safe(() => new Date(stats.date).toLocaleDateString()) || "Date not set"
	}
  Location: ${stats.location}
  
  Registration Statistics
  ---------------------
  Total Registrations: ${stats.registration.total}
  Maximum Capacity: ${stats.registration.maxCapacity}
  Registration Rate: ${stats.registration.registrationRate}
  
  Attendance Statistics
  -------------------
  Total Attendees: ${stats.attendance.total}
  Attendance Rate: ${stats.attendance.attendanceRate}
  On-time Arrivals: ${stats.attendance.onTime}
  Late Arrivals: ${stats.attendance.late}
  
  Feedback Status
  -------------
  ${
		safe(() => {
			if (typeof stats.feedback.form === "string") return stats.feedback.form;
			return `Responses Received: ${stats.feedback.form.totalResponses}
  Response Rate: ${stats.feedback.form.responseRate}`;
		}) || "Feedback data not available"
	}
  
  Resource Summary
  --------------
  Total Resources: ${stats.resources.totalCount}
  Types: ${JSON.stringify(stats.resources.types || {}, null, 2)}
  
  Timeline
  --------
  Created: ${
		safe(() => new Date(stats.timeline.created).toLocaleDateString()) ||
		"Date not recorded"
	}
  Registration Deadline: ${
		safe(() =>
			stats.timeline.registrationDeadline
				? new Date(stats.timeline.registrationDeadline).toLocaleDateString()
				: "Not set"
		) || "Not set"
	}
  Event Date: ${
		safe(() => new Date(stats.timeline.eventDate).toLocaleDateString()) ||
		"Not set"
	}
  Current Status: ${stats.timeline.status}
  
  ${
		stats.schedule
			? `
  Schedule
  --------
  ${
		safe(() =>
			stats.schedule
				.map(
					(s) =>
						`${s?.time || "Time not set"}: ${
							s?.activity || "Activity not specified"
						}`
				)
				.join("\n")
		) || "Schedule data error"
	}
  `
			: "No schedule provided"
	}
  `.trim();

		// Safely update the report field
		if (report) {
			this.report = report;
			await this.save().catch((err) => {
				console.error("Error saving report:", err);
			});
		}

		return {
			text: report,
			stats: stats,
		};
	} catch (error) {
		console.error("Error generating report:", error);
		return {
			text: "Error generating report",
			stats: {},
			error: error.message,
		};
	}
};

export const Event = mongoose.model("Event", EventSchema);
