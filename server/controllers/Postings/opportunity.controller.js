import { Application } from "../../models/Postings/Application.js";
import { Opportunity } from "../../models/Postings/Opportunity.js";
import { User } from "../../models/User.Model.js";
import mongoose from "mongoose";
export const createOpportunity = async (req, res) => {
	try {
		const { title, description, type, rounds } = req.body;
		const alumniId = req.user?.id;

		// ✅ Check if required fields are missing
		if (!title || !description || !type || !rounds || !Array.isArray(rounds)) {
			return res.status(400).json({
				message:
					"All fields (title, description, type, rounds) are required and rounds must be an array.",
			});
		}

		// ✅ Validate rounds structure
		const isValidRounds = rounds.every(
			(round) =>
				typeof round.type === "string" &&
				(round.testType === undefined ||
					round.testType === null ||
					typeof round.testType === "string")
		);

		if (!isValidRounds) {
			return res.status(400).json({
				message:
					"Each round must have a valid 'type' (string) and an optional 'testType' (string or null).",
			});
		}

		// ✅ Format rounds before saving
		const formattedRounds = rounds.map((round, index) => ({
			type: round.type,
			testType: round.testType || null,
			order: index + 1,
			studentIds: [],
		}));

		// ✅ Create new opportunity
		const opportunity = new Opportunity({
			title,
			description,
			type,
			alumni: alumniId,
			currentRound: 0,
			rounds: formattedRounds,
			lastUpdatedBy: alumniId,
		});

		// ✅ Save to database
		await opportunity.save();
		return res
			.status(201)
			.json({ message: "Opportunity created successfully!", opportunity });
	} catch (error) {
		// ✅ Handle Mongoose validation errors
		if (error.name === "ValidationError") {
			return res
				.status(400)
				.json({ message: "Validation Error", errors: error.errors });
		}

		// ✅ Handle all other unexpected errors
		console.error("❌ Error creating opportunity:", error);
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

// 2. Submit Student Application
export const submitStudentApplication = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { opportunityId } = req.params;
		const studentId = req.user._id; // Assuming authenticated student

		// Check for existing application
		const existingApplication = await Application.findOne({
			student: studentId,
			opportunity: opportunityId,
		}).session(session);

		if (existingApplication) {
			return res
				.status(400)
				.json({ message: "Already applied to this opportunity" });
		}

		// Create application
		const application = new Application({
			student: studentId,
			opportunity: opportunityId,
			currentRound: 0,
		});

		await application.save({ session });

		// Add to first round
		await Opportunity.findByIdAndUpdate(
			opportunityId,
			{ $push: { "rounds.0.studentIds": studentId } },
			{ session, new: true }
		);

		await session.commitTransaction();
		res.status(201).json(application);
	} catch (error) {
		await session.abortTransaction();
		res
			.status(500)
			.json({ message: "Application failed", error: error.message });
	} finally {
		session.endSession();
	}
};

// 3. Process Round Evaluation
export const processRoundEvaluation = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { applicationId } = req.params;
		const { status, feedback, roundNumber } = req.body;

		// Validate evaluation data
		if (!["Passed", "Rejected"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const application = await Application.findById(applicationId)
			.populate("opportunity")
			.session(session);

		// Validate round sequence
		if (application.currentRound !== roundNumber) {
			return res.status(400).json({
				message: `Student is currently in round ${application.currentRound}`,
			});
		}

		// Add round result
		application.results.push({
			roundNumber,
			status,
			feedback,
			evaluatedAt: new Date(),
		});

		if (status === "Passed") {
			const opportunity = application.opportunity;
			const nextRound = opportunity.rounds.find(
				(r) => r.order === application.currentRound + 1
			);

			if (nextRound) {
				application.currentRound += 1;
				await Opportunity.findByIdAndUpdate(
					opportunity._id,
					{
						$push: {
							[`rounds.${nextRound.order}.studentIds`]: application.student,
						},
					},
					{ session }
				);
			} else {
				application.status = "Selected";
			}
		} else {
			application.status = "Rejected";
		}

		await application.save({ session });
		await session.commitTransaction();
		res.json(application);
	} catch (error) {
		await session.abortTransaction();
		res
			.status(500)
			.json({ message: "Evaluation failed", error: error.message });
	} finally {
		session.endSession();
	}
};

// 4. Proceed to Next Round
export const proceedToNextRound = async (req, res) => {
	try {
		const { opportunityId } = req.params;
		const opportunity = await Opportunity.findById(opportunityId);

		if (!opportunity) {
			return res.status(404).json({ message: "Opportunity not found" });
		}

		const nextRoundNumber = opportunity.currentRound + 1;
		if (nextRoundNumber >= opportunity.rounds.length) {
			return res.status(400).json({ message: "No more rounds available" });
		}

		opportunity.currentRound = nextRoundNumber;
		opportunity.lastUpdatedBy = req.user._id; // Track admin
		await opportunity.save();

		res.json(opportunity);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Round advancement failed", error: error.message });
	}
};

// 5. Close Opportunity Selection
export const closeOpportunitySelection = async (req, res) => {
	try {
		const { opportunityId } = req.params;
		const opportunity = await Opportunity.findByIdAndUpdate(
			opportunityId,
			{
				isOpen: false,
				lastUpdatedBy: req.user._id,
			},
			{ new: true }
		);

		if (!opportunity) {
			return res.status(404).json({ message: "Opportunity not found" });
		}

		res.json({ message: "Opportunity closed successfully", opportunity });
	} catch (error) {
		res.status(500).json({ message: "Closing failed", error: error.message });
	}
};
