import { Club } from "../../models/Roles/Club.Model.js";
import { Event } from "../../models/Postings/Event.Model.js";
import { addNotification } from "../notification.controller.js";

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
