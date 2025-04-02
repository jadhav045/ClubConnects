import mongoose from "mongoose";

// Enum for notification types
export const NotificationType = {
	TRIP_UPDATE: "TRIP_UPDATE", // Updates related to trip planning
	BOOKING_CONFIRMATION: "BOOKING_CONFIRMATION", // Confirmation for bookings (transport, stay, etc.)
	GROUP_TOUR_UPDATE: "GROUP_TOUR_UPDATE", // Updates related to group tours
	WEATHER_ADVISORY: "WEATHER_ADVISORY", // Weather updates or travel advisories
	ECO_TRAVEL_SUGGESTION: "ECO_TRAVEL_SUGGESTION", // Suggestions for eco-friendly travel
	NEW_MESSAGE: "NEW_MESSAGE", // Notifications for new chat messages
};

// Define the schema for Notification
const NotificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: Object.values(NotificationType),
			required: true,
		},
		from: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		to: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", // Reference to the User model for the recipients
				required: true,
			},
		],
		tripId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Trip", // Reference to the Trip model (if the notification is related to a trip)
			required: false,
		},
		bookingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking", // Reference to the Booking model (if the notification is related to a booking)
			required: false,
		},
		groupTourId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "GroupTour", // Reference to the GroupTour model (if the notification is related to a group tour)
			required: false,
		},
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat", // Reference to the Chat model (if the notification is related to a chat)
			required: false,
		},
		message: {
			type: String,
			required: true, // The message content of the notification
		},
		isRead: {
			type: Boolean,
			default: false, // Whether the notification is read or not
		},
		createdAt: {
			type: Date,
			default: Date.now, // Automatically sets the notification creation time
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);

// Export the Notification model
export const Notification = mongoose.model("Notification", NotificationSchema);
