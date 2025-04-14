import { Notification } from "../../models/Notifications.js";
import { Application } from "../../models/Postings/Application.js";
import { Opportunity } from "../../models/Postings/Opportunity.js";
import { User } from "../../models/User.Model.js";
import mongoose from "mongoose";
export const createOpportunity = async (req, res) => {
	try {
		const { title, description, type, rounds, deadline } = req.body;
		const alumniId = req.user?.id;
		console.log(alumniId);

		// Validate required fields
		if (!title || !description || !type || !rounds || !Array.isArray(rounds)) {
			return res.status(400).json({
				message:
					"All fields (title, description, type, rounds) are required and rounds must be an array.",
			});
		}

		const user = await User.findById(alumniId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Validate rounds structure
		const isValidRounds = rounds.every(
			(round) =>
				round.type &&
				typeof round.type === "string" &&
				round.deadline &&
				new Date(round.deadline) > new Date()
		);

		if (!isValidRounds) {
			return res.status(400).json({
				message: "Each round must have a valid type and future deadline.",
			});
		}

		// Format rounds with order
		const formattedRounds = rounds.map((round, index) => ({
			type: round.type,
			testType: round.testType || "null",
			order: index,
			deadline: new Date(round.deadline),
			studentIds: [],
			status: index === 0 ? "ONGOING" : "PENDING",
		}));

		if (!deadline || new Date(deadline) < new Date()) {
			return res.status(400).json({
				message: "Valid deadline is required and must be in the future",
			});
		}

		// Create opportunity
		const opportunity = new Opportunity({
			title,
			description,
			type,
			alumni: alumniId,
			currentRound: 0,
			rounds: formattedRounds,
			deadline: new Date(deadline),
			lastUpdatedBy: alumniId,
			status: "OPEN",
		});


		

		user.opportunities.push(opportunity._id);
		await user.save();

		await opportunity.save();

		return res.status(201).json({
			message: "Opportunity created successfully!",
			opportunity,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({
				message: "Validation Error",
				errors: Object.values(error.errors).map((err) => err.message),
			});
		}
		console.error("Error creating opportunity:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
};

export const deleteOpportunity = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { opportunityId } = req.params;
		const userId = req.user.id;

		// Check if opportunity exists and user has permission
		const opportunity = await Opportunity.findById(opportunityId);
		if (!opportunity) {
			return res.status(404).json({
				success: false,
				message: "Opportunity not found",
			});
		}

		// Verify if the user has permission to delete
		if (opportunity.alumni.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "You don't have permission to delete this opportunity",
			});
		}

		// Delete all related applications first
		await Application.deleteMany({ opportunity: opportunityId }, { session });

		// Delete the opportunity
		await Opportunity.findByIdAndDelete(opportunityId, { session });

		// Commit the transaction
		await session.commitTransaction();

		return res.status(200).json({
			success: true,
			message: "Opportunity and related applications deleted successfully",
		});
	} catch (error) {
		// Rollback in case of error
		await session.abortTransaction();

		console.error("Error deleting opportunity:", error);
		return res.status(500).json({
			success: false,
			message: "Error deleting opportunity",
			error: error.message,
		});
	} finally {
		session.endSession();
	}
};
export const getOpportunities = async (req, res) => {
	try {
		const { page = 1, limit = 10, type } = req.query;

		// console.log(req.query);
		const pageNumber = parseInt(page, 10);
		const limitNumber = parseInt(limit, 10);

		// 🔹 Construct filter query
		const query = type ? { type } : {};

		// console.log("Query:", query); // Debugging query
		//
		// 🔹 Fetch opportunities
		const opportunities = await Opportunity.find(query)
			.skip((pageNumber - 1) * limitNumber)
			.limit(limitNumber)
			.sort({ createdAt: -1 });

		// console.log("Fetched Opportunities:", opportunities); // Debugging results

		const total = await Opportunity.countDocuments(query);

		return res.status(200).json({
			message: "Opportunities fetched successfully!",
			data: opportunities,
			pagination: {
				total,
				page: pageNumber,
				limit: limitNumber,
				totalPages: Math.ceil(total / limitNumber),
			},
		});
	} catch (error) {
		console.error("Error fetching opportunities:", error);
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

export const advanceToNextRound = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { opportunityId } = req.params;
		const { userIds, currentRound } = req.body;

		console.log("userOIds", userIds);
		// Validate request
		if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid user selection",
			});
		}

		// Find opportunity and validate
		const opportunity = await Opportunity.findById(opportunityId);
		if (!opportunity) {
			return res.status(404).json({
				success: false,
				message: "Opportunity not found",
			});
		}

		// Check if user has permission
		if (opportunity.alumni.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to manage this opportunity",
			});
		}

		// Validate current round
		if (currentRound >= opportunity.rounds.length - 1) {
			return res.status(400).json({
				success: false,
				message: "Already in final round",
			});
		}

		const nextRound = currentRound + 1;

		// Update round statuses
		opportunity.rounds[currentRound].status = "COMPLETED";
		opportunity.rounds[nextRound].status = "ONGOING";
		opportunity.currentRound = nextRound;

		// Update participants for next round
		opportunity.rounds[nextRound].studentIds = userIds;

		// Save changes
		await opportunity.save({ session });

		// Create notifications for selected users
		const notifications = userIds.map((userId) => ({
			userId,
			title: `Selected for Next Round - ${opportunity.title}`,
			message: `Congratulations! You've been selected for Round ${
				nextRound + 1
			} (${opportunity.rounds[nextRound].type})`,
			type: "ROUND_ADVANCEMENT",
			entityId: opportunityId,
			entityType: "Opportunity",
		}));

		await Notification.insertMany(notifications, { session });

		// Commit transaction
		await session.commitTransaction();

		return res.status(200).json({
			success: true,
			message: `Successfully moved ${userIds.length} users to round ${
				nextRound + 1
			}`,
			data: {
				currentRound: nextRound,
				selectedUsers: userIds,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		console.error("Error advancing round:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to advance round",
			error: error.message,
		});
	} finally {
		session.endSession();
	}
};

export const getRoundStudents = async (req, res) => {
	try {
		console.log("Backend");
		const { opportunityId, roundNumber } = req.params;

		const result = await Opportunity.getStudentsByRound(
			opportunityId,
			parseInt(roundNumber)
		);

		console.log(data);
		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
