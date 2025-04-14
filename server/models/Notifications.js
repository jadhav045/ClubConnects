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
		entityType: {
			type: String,
			enum: ["Opportunity", "Event", "Post", "Discussion"],
			required: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: "entityType",
		},
		message: {
			type: String,
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
