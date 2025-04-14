import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ["SCREENING", "INTERVIEW", "QUIZ", "DSA", "PROJECT", "PAPER"],
		required: true,
	},
	testType: {
		type: String,
		enum: ["TECHNICAL", "CODING", "APTITUDE", "HR", "null"],
		default: "null",
	},
	order: {
		type: Number,
		required: true,
	},
	deadline: {
		type: Date,
	},
	studentIds: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "User",
		default: [],
	},
	status: {
		type: String,
		enum: ["PENDING", "ONGOING", "COMPLETED"],
		default: "PENDING",
	},
});

const opportunitySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["Industry Project", "Internship", "Job", "Research", "Other"],
			required: true,
		},
		registrationForm: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Form",
			default: null,
		},
		alumni: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		currentRound: { type: Number, default: 0 },
		rounds: [roundSchema],
		lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			type: String,
			enum: ["DRAFT", "OPEN", "IN_PROGRESS", "CLOSED"],
			default: "OPEN",
		},
		deadline: {
			type: Date,
			required: true,
		},
		roundDeadlines: [
			{
				roundNumber: Number,
				deadline: Date,
			},
		],
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

// Add a method to check if opportunity is open
opportunitySchema.methods.isOpen = function () {
	return this.status === "OPEN" && new Date() < this.deadline;
};

// Add a method to check round deadline
opportunitySchema.methods.isRoundOpen = function (roundNumber) {
	const round = this.rounds[roundNumber];
	return round && new Date() < round.deadline;
};

// ...existing code...

// Add after other methods, before model export
opportunitySchema.statics.getStudentsByRound = async function (
	opportunityId,
	roundNumber
) {
	try {
		const opportunity = await this.findById(opportunityId)
			.select("rounds.studentIds rounds.type title")
			.exec();

		if (!opportunity) {
			throw new Error("Opportunity not found");
		}

		if (roundNumber >= opportunity.rounds.length) {
			throw new Error("Invalid round number");
		}

		const round = opportunity.rounds[roundNumber];

		return {
			studentIds: round.studentIds,
			roundType: round.type,
			opportunityTitle: opportunity.title,
		};
	} catch (error) {
		throw new Error(`Failed to fetch students: ${error.message}`);
	}
};

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
