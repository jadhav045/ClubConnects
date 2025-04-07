import mongoose from "mongoose";
import { Event } from "../../models/Postings/Event.Model.js";
import { Club } from "../../models/Roles/Club.Model.js";

export const getClubs = async (req, res) => {
	try {
		console.log("f");
		const [
			totalMembersAgg,
			clubsSummary,
			eventTypeStats,
			memberRoleStats,
			upcomingEvents,
			allEventsLean,
			eventsWithOrganizer,
		] = await Promise.all([
			// Total members
			Club.aggregate([
				{ $project: { memberCount: { $size: "$members" } } },
				{ $group: { _id: null, total: { $sum: "$memberCount" } } },
			]),

			// Clubs summary
			Club.aggregate([
				{
					$project: {
						clubName: 1,
						status: 1,
						totalMembers: { $size: "$members" },
						eventsHosted: { $size: "$events" },
					},
				},
			]),

			// Event Type Distribution
			Event.aggregate([
				{ $group: { _id: "$eventType", count: { $sum: 1 } } },
				{
					$group: {
						_id: null,
						total: { $sum: "$count" },
						types: {
							$push: { type: "$_id", count: "$count" },
						},
					},
				},
				{ $unwind: "$types" },
				{
					$project: {
						_id: 0,
						eventType: "$types.type",
						count: "$types.count",
						ratio: {
							$round: [
								{ $multiply: [{ $divide: ["$types.count", "$total"] }, 100] },
								2,
							],
						},
					},
				},
			]),

			// Member Role Stats
			Club.aggregate([
				{ $unwind: "$members" },
				{ $group: { _id: "$members.role", count: { $sum: 1 } } },
				{
					$group: {
						_id: null,
						total: { $sum: "$count" },
						roles: { $push: { role: "$_id", count: "$count" } },
					},
				},
				{ $unwind: "$roles" },
				{
					$project: {
						_id: 0,
						role: "$roles.role",
						count: "$roles.count",
						ratio: {
							$round: [
								{ $multiply: [{ $divide: ["$roles.count", "$total"] }, 100] },
								2,
							],
						},
					},
				},
			]),

			// Upcoming Events
			Event.find({ eventDateTime: { $gte: new Date() } })
				.select("title eventDateTime")
				.sort({ eventDateTime: 1 })
				.lean(),

			// All Events
			Event.find().select("eventDateTime title participants").lean(),

			// Events with organizer
			Event.find({}, "eventDateTime title eventType")
				.populate({ path: "organizer", select: "clubName" })
				.lean(),
		]);

		// Ensure all values are defaulted safely
		const safeTotalMembers = totalMembersAgg?.[0]?.total || 0;

		const safeEventsWithOrganizer =
			eventsWithOrganizer?.map((event) => ({
				...event,
				organizer: event.organizer?.clubName || "Unknown Organizer",
			})) || [];

		const participantCounts =
			allEventsLean?.map((event) => ({
				title: event.title,
				participantCount: Array.isArray(event.participants)
					? event.participants.length
					: 0,
			})) || [];

		const monthlyEventTrend =
			allEventsLean?.reduce((acc, event) => {
				if (!event?.eventDateTime) return acc;
				const date = new Date(event.eventDateTime);
				const key = `${date.getFullYear()}-${String(
					date.getMonth() + 1
				).padStart(2, "0")}`;
				acc[key] = (acc[key] || 0) + 1;
				return acc;
			}, {}) || {};

		const result = {
			clubs: clubsSummary || [],
			totalMembers: safeTotalMembers,
			eventsWithOrganizer: safeEventsWithOrganizer,
			eventTypeStats: eventTypeStats || [],
			memberRoleStats: memberRoleStats || [],
			upcomingEvents: upcomingEvents || [],
			participantCounts,
			monthlyEventTrend,
		};
		console.log("getCLubs", result);

		return res.json(result);
	} catch (error) {
		console.error("Error fetching clubs:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getClubAnalytics = async (req, res) => {
	try {
		console.log("s");
		const { clubId } = req.params;

		if (!clubId || !mongoose.Types.ObjectId.isValid(clubId)) {
			return res.status(400).json({ error: "Valid Club ID is required" });
		}

		const clubExists = await Club.findById(clubId).lean();
		if (!clubExists) {
			return res.status(404).json({ error: "Club not found" });
		}

		const [eventStats, memberRoleStats, upcomingEvents, clubEvents] =
			await Promise.all([
				// Event Type stats
				Event.aggregate([
					{ $match: { organizer: new mongoose.Types.ObjectId(clubId) } },
					{ $group: { _id: "$eventType", count: { $sum: 1 } } },
					{
						$group: {
							_id: null,
							total: { $sum: "$count" },
							types: { $push: { type: "$_id", count: "$count" } },
						},
					},
					{ $unwind: "$types" },
					{
						$project: {
							_id: 0,
							eventType: "$types.type",
							count: "$types.count",
							ratio: {
								$round: [
									{ $multiply: [{ $divide: ["$types.count", "$total"] }, 100] },
									2,
								],
							},
						},
					},
				]),

				// Member role stats
				Club.aggregate([
					{ $match: { _id: new mongoose.Types.ObjectId(clubId) } },
					{ $unwind: "$members" },
					{ $group: { _id: "$members.role", count: { $sum: 1 } } },
					{
						$group: {
							_id: null,
							total: { $sum: "$count" },
							roles: { $push: { role: "$_id", count: "$count" } },
						},
					},
					{ $unwind: "$roles" },
					{
						$project: {
							_id: 0,
							role: "$roles.role",
							count: "$roles.count",
							ratio: {
								$round: [
									{ $multiply: [{ $divide: ["$roles.count", "$total"] }, 100] },
									2,
								],
							},
						},
					},
				]),

				// Upcoming events
				Event.find({
					organizer: clubId,
					eventDateTime: { $gte: new Date() },
				})
					.select("title eventDateTime")
					.sort({ eventDateTime: 1 })
					.lean(),

				// All events for trend and participants
				Event.find({ organizer: clubId })
					.select("eventDateTime title participants")
					.lean(),
			]);

		// Defensive fallback: If no events found
		const safeClubEvents = Array.isArray(clubEvents) ? clubEvents : [];

		const participantCounts = safeClubEvents.map((event) => ({
			title: event?.title || "Untitled Event",
			participantCount: Array.isArray(event?.participants)
				? event.participants.length
				: 0,
		}));

		const monthlyEventTrend = safeClubEvents.reduce((acc, event) => {
			if (!event?.eventDateTime) return acc;
			const date = new Date(event.eventDateTime);
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
				2,
				"0"
			)}`;
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {});

		const result = {
			club: {
				id: clubExists._id,
				name: clubExists.clubName || "Unnamed Club",
			},
			totalMembers: Array.isArray(clubExists.members)
				? clubExists.members.length
				: 0,
			eventsHosted: safeClubEvents.length,
			eventTypeStats: eventStats || [],
			memberRoleStats: memberRoleStats || [],
			upcomingEvents: upcomingEvents || [],
			participantCounts,
			monthlyEventTrend,
		};

		console.log("getClubsAnalytics", result);
		return res.json(result);
	} catch (error) {
		console.error("Error in getClubAnalytics:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
