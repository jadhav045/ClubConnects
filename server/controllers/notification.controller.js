import { io } from "../index.js";
import { Notification } from "../models/Notifications.js";
import { User } from "../models/User.Model.js";

// Add a new notification and emit it to all connected clients
export async function addNotification(data, userId) {
	try {
		const newNotification = new Notification(data);
		await newNotification.save(); // Use save() if using Mongoose

		// Emit the notification to all connected clients
		io.emit("notification", JSON.stringify(data)); // Send notification to clients

		console.log("Notification added successfully");

		return {
			message: "Notification created successfully",
			data: newNotification,
		};
	} catch (error) {
		console.log("Error in adding notification: ", error);
		return { error: "Failed to add notification", details: error };
	}
}

// Get all notifications for a specific user by their 'id'
export async function getAllNotifications(id) {
	try {
		const notifications = await Notification.find({ to: id });

		return notifications;
	} catch (error) {
		console.log("Error in fetching notifications: ", error);
		return { error: "Failed to fetch notifications", details: error };
	}
}
