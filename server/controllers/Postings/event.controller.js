import { Club } from "../../models/Roles/Club.Model.js";
import { Event } from "../../models/Postings/Event.Model.js";
import { addNotification } from "../notification.controller.js";
import { uploadFile } from "../../utils/fileUpload.js";
import { Response } from "../../models/Form/Response.js";

export const createEvent = async (req, res) => {
	try {
		const {
			title,
			eventType,
			description,
			detailedDescription,
			eventDateTime,
			location,
			schedule,
			// resources,
			organizer,
			registrationDeadline,
			tags,
			maxParticipants,
		} = req.body;

		console.log(req.body);
		// Basic field validation
		console.log("Event");
		if (
			!title ||
			!eventType ||
			!description ||
			!eventDateTime ||
			!location ||
			!organizer
		) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Validate event date and registration deadline
		if (new Date(eventDateTime) <= new Date()) {
			return res
				.status(401)
				.json({ message: "Event date must be in the future" });
		}
		if (registrationDeadline && new Date(registrationDeadline) <= new Date()) {
			return res
				.status(402)
				.json({ message: "Registration deadline must be in the future" });
		}

		// Validate schedule and resources
		if (!Array.isArray(schedule) || schedule.length === 0) {
			return res
				.status(403)
				.json({ message: "Schedule must contain at least one item" });
		}

		// if (!Array.isArray(resources)) {
		// 	return res.status(400).json({ message: "Resources must be an array" });
		// }

		// Check if organizer exists in Club

		const club = await Club.findById(organizer);
		if (!club) {
			return res.status(404).json({ message: "Organizer club not found" });
		}

		console.log("je");

		const newEvent = new Event({
			title,
			eventType,
			description,
			detailedDescription,
			eventDateTime,
			location,
			schedule,
			// resources,
			organizer,
			registrationDeadline,
			tags,
			maxParticipants,
		});

		console.log("new Even ");
		// Save to database
		await newEvent.save();

		club.events.push(newEvent._id);
		await club.save(); // Save the updated club document
		console.log("D");
		return res.status(201).json({
			message: "Event created successfully",
			event: newEvent,
			success: true,
		});
	} catch (error) {
		console.error("Server Error:", error);
		return res.status(500).json({
			message: "Server error",
			error: error.message,
			stack: error.stack,
			success: false,
		});
	}
};
export const getAllEvents = async (req, res) => {
	try {
		const events = await Event.find()
			.populate("organizer", "clubName motto logo _id")
			.sort({ eventDateTime: 1 });

		res.status(200).json({
			success: true,
			count: events.length,
			events,
		});
	} catch (error) {}
};
export const sendReminder = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { message } = req.body;

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const data = {
			type: "TRIP_UPDATE",
			from: event.organizer, // or req.user.id if you're using auth
			to: event.participants, // already an array
			entityType: "Event",
			entityId: event._id,
			message,
		};

		console.log("Sending reminder to participants...");
		await addNotification(data, event.organizer); // or req.user.id

		return res.json({
			message: "Reminder sent",
			participants: event.participants,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		});
	}
};

export const addReport = async (req, res) => {
	try {
		const { eventId } = req.params;
		const file = req.file;

		console.log("EventId", eventId);
		console.log("File received:", file); // Debug log to verify file is received

		if (!file) {
			return res.status(400).json({ message: "No file provided" });
		}

		// Upload the file to cloud storage (e.g., Cloudinary, AWS S3)
		const { fileUrl } = await uploadFile(file);

		// Update the event with the report URL in your database
		const updatedEvent = await Event.findByIdAndUpdate(
			eventId,
			{ report: fileUrl },
			{ new: true }
		);

		if (!updatedEvent) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Return success response
		return res.status(200).json({
			message: "Report uploaded successfully",
			reportUrl: fileUrl,
			event: updatedEvent,
			success: true,
		});
	} catch (error) {
		console.error("Error in addReport:", error);
		res.status(500).json({ message: "Failed to upload report" });
	}
};

// Example API route usage
export const giveAttendance = async (req, res) => {
	try {
		const userId = req.user.id;
		const { eventId } = req.params;
		const { code } = req.body;

		console.log();

		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				success: false,
				error: "EVENT_NOT_FOUND",
				message: "Event not found",
			});
		}

		if (!event.isAttendanceOpen) {
			return res.status(400).json({
				success: false,
				error: "ATTENDANCE_CLOSED",
				message: "Attendance window is not open",
			});
		}

		// Verify attendance code

		console.log("ss", event.verifyAttendanceCode(code));
		if (!event.verifyAttendanceCode(code)) {
			console.log("Verifuing", code);
			return res.status(400).json({
				success: false,
				error: "INVALID_CODE",
				message: "Invalid attendance code or window closed",
			});
		}

		// Mark attendance
		await event.markAttendance(userId);

		res.status(200).json({
			success: true,
			message: "Attendance marked successfully",
			data: {
				eventId: event._id,
				markedAt: new Date(),
				userId,
			},
		});
	} catch (error) {
		if (error.message === "User is not registered for this event") {
			return res.status(403).json({
				success: false,
				error: "NOT_REGISTERED",
				message: error.message,
			});
		}

		if (error.message === "Attendance already marked") {
			return res.status(400).json({
				success: false,
				error: "ALREADY_MARKED",
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			error: "SERVER_ERROR",
			message: "Internal server error",
		});
	}
};
// Route to open attendance window (for organizers)
export const openAttendance = async (req, res) => {
	try {
		console.log("EVE", req.body);
		const { eventId } = req.params;
		const { duration, code } = req.body;

		// Get current time
		const startTime = new Date();

		// Calculate end time by adding duration (assumed in minutes)
		const endTime = new Date(startTime.getTime() + duration * 60000); // 60000 ms = 1 min

		console.log("Start Time:", startTime.toISOString());
		console.log("End Time:", endTime.toISOString());

		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		await event.setAttendanceWindow(
			new Date(startTime),
			new Date(endTime),
			code
		);

		res.json({
			success: true,
			message: "Attendance window opened successfully",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const checkUserFormStatus = async (req, res) => {
	try {
		const { eventId } = req.params;
		const userId = req.user.id;
		const { type } = req.body;

		if (!["REGISTRATION", "FEEDBACK"].includes(type)) {
			return res
				.status(400)
				.json({ error: "Invalid type (registration or feedback expected)" });
		}

		if (!eventId || !userId) {
			return res.status(400).json({ error: "Missing eventId or userId" });
		}

		// Fetch the event to get form ID
		const event = await Event.findById(eventId);
		if (!event) return res.status(404).json({ error: "Event not found" });

		const formId =
			type === "REGISTRATION" ? event.registrationForm : event.feedbackForm;

		if (!formId) return res.json({ filled: false });

		const response = await Response.findOne({
			form: formId,
			user: userId,
			entityType: "Event",
			entityId: eventId,
		});

		return res.json({ filled: !!response });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

export const submitFeedback = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { rating, experience, suggestions, improvements, userId } = req.body;

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if user has attended
		const hasAttended = event.attendance.some(
			(a) => a.user.toString() === userId
		);

		if (!hasAttended) {
			return res.status(403).json({
				success: false,
				message: "Must attend event to give feedback",
			});
		}

		// Add feedback to event
		event.feedback.push({
			user: userId,
			rating,
			experience,
			suggestions,
			improvements,
			submittedAt: new Date(),
		});

		await event.save();

		res.status(200).json({
			success: true,
			message: "Feedback submitted successfully",
		});
	} catch (error) {
		console.error("Error submitting feedback:", error);
		res.status(500).json({
			success: false,
			message: "Failed to submit feedback",
		});
	}
};
