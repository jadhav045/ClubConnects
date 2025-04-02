import cron from "node-cron";
import { Event } from "../models/Postings/Event.Model.js";

export const startEventScheduler = () => {
	// Initial startup log
	console.log(
		"Event Scheduler started at:",
		new Date().toLocaleString("en-US", {
			timeZone: "Asia/Kolkata",
			hour12: true,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
	);

	cron.schedule("0 0 * * *", async () => {
		try {
			const currentTime = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Kolkata",
				hour12: true,
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});

			console.log("\n----------------------------------");
			console.log("⏰ Checking events at:", currentTime);
			await Event.updateRegistrationStatuses();
			console.log("✅ Registration statuses updated successfully");
			console.log("----------------------------------\n");
		} catch (error) {
			console.error("❌ Error updating event statuses:", error);
		}
	});
};





// import { checkAndUpdateDeadlines } from '../controllers/Postings/opportunity.controller.js';

// Run every hour
// cron.schedule('0 * * * *', async () => {
//     console.log('Checking opportunity deadlines...');
//     await checkAndUpdateDeadlines();
// });